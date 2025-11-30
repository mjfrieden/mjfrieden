import fs from 'fs';
import { SignJWT, importPKCS8 } from 'jose';
import { FhirImmunization, FhirPatient, ShcBundle } from '@whitecloud/fhir-types';
import QRCode from 'qrcode';
import { config } from '../config/env';

export class SmartHealthCardService {
  async loadKey() {
    const pem = fs.readFileSync(config.shcSigningKeyPath, 'utf-8');
    return importPKCS8(pem, 'ES256');
  }

  buildBundle(patient: FhirPatient, immunizations: FhirImmunization[]): ShcBundle {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [patient, ...immunizations].map((resource) => ({ resource })),
    };
  }

  async signBundle(bundle: ShcBundle): Promise<string> {
    const key = await this.loadKey();
    const payload = {
      iss: 'https://whitecloud.example',
      nbf: Math.floor(Date.now() / 1000),
      vc: {
        type: ['https://smarthealth.cards#health-card', 'https://smarthealth.cards#immunization'],
        credentialSubject: { fhirVersion: '4.0.1', fhirBundle: bundle },
      },
    };
    const jws = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'ES256', kid: 'dev-key' })
      .sign(key);
    return jws;
  }

  jwsToShcNumeric(jws: string): string {
    const base = jws.replace(/\./g, '');
    let output = '';
    for (const char of base) {
      output += (char.charCodeAt(0) - 45).toString().padStart(2, '0');
    }
    return `shc:/${output}`;
  }

  async toQrDataUrl(jws: string): Promise<string> {
    const numeric = this.jwsToShcNumeric(jws);
    return QRCode.toDataURL(numeric);
  }
}
