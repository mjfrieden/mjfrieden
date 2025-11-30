import { FhirImmunization } from '@whitecloud/fhir-types';

export function normalizeImmunizations(records: FhirImmunization[]): FhirImmunization[] {
  const seen = new Map<string, FhirImmunization>();
  for (const record of records) {
    const key = `${record.vaccineCode.coding?.[0]?.code ?? record.vaccineCode.text}-${record.occurrenceDateTime}`;
    if (!seen.has(key)) {
      seen.set(key, record);
    }
  }
  return Array.from(seen.values());
}

export function formatVaccineName(record: FhirImmunization): string {
  const coding = record.vaccineCode.coding?.[0];
  return coding?.display || coding?.code || record.vaccineCode.text || 'Vaccine';
}
