import { SmartHealthCardService } from '../services/SmartHealthCardService';
import { FhirPatient, FhirImmunization } from '@whitecloud/fhir-types';
import fs from 'fs';

const pem = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIF6I7rWhsHQ1hIkvZ7nPdyzobzWP4oaE+xbkLIE1JwwK
-----END PRIVATE KEY-----`;

beforeAll(() => {
  fs.writeFileSync('shc-private-key.pem', pem);
});

afterAll(() => {
  fs.rmSync('shc-private-key.pem');
});

test('builds bundle and numeric payload', async () => {
  const service = new SmartHealthCardService();
  const patient: FhirPatient = { resourceType: 'Patient', id: '1', name: [{ given: ['Test'], family: 'User' }], birthDate: '1990-01-01' };
  const immunizations: FhirImmunization[] = [
    {
      resourceType: 'Immunization',
      status: 'completed',
      vaccineCode: { text: 'Demo Vaccine' },
      patient: { reference: 'Patient/1' },
      occurrenceDateTime: '2023-01-01',
    },
  ];
  const bundle = service.buildBundle(patient, immunizations);
  expect(bundle.entry.length).toBe(2);
  const jws = await service.signBundle(bundle);
  expect(jws.split('.').length).toBe(3);
  const numeric = service.jwsToShcNumeric(jws);
  expect(numeric.startsWith('shc:/')).toBe(true);
});
