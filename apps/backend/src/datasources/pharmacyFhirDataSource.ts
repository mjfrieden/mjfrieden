import fs from 'fs';
import path from 'path';
import { ImmunizationDataSource } from './types';
import { FhirImmunization } from '@whitecloud/fhir-types';

export class PharmacyFhirDataSource implements ImmunizationDataSource {
  id = 'pharmacy';
  displayName = 'Pharmacy/Clinic';

  async connect(_userId: string): Promise<void> {
    return;
  }

  async fetchImmunizations(_userId: string): Promise<FhirImmunization[]> {
    const file = path.join(__dirname, '..', 'data', 'pharmacy.json');
    const json = fs.readFileSync(file, 'utf-8');
    return JSON.parse(json) as FhirImmunization[];
  }
}
