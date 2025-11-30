import fs from 'fs';
import path from 'path';
import { ImmunizationDataSource } from './types';
import { FhirImmunization } from '@whitecloud/fhir-types';

export class SmartOnFhirDataSource implements ImmunizationDataSource {
  id = 'smart_on_fhir';
  displayName = 'SMART on FHIR Provider';

  async connect(_userId: string): Promise<void> {
    // Placeholder for OAuth2/SMART on FHIR auth
    return;
  }

  async fetchImmunizations(_userId: string): Promise<FhirImmunization[]> {
    const file = path.join(__dirname, '..', 'data', 'smart-on-fhir.json');
    const json = fs.readFileSync(file, 'utf-8');
    return JSON.parse(json) as FhirImmunization[];
  }
}
