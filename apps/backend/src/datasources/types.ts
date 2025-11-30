import { FhirImmunization } from '@whitecloud/fhir-types';

export interface ImmunizationDataSource {
  id: string;
  displayName: string;
  connect(userId: string): Promise<void>;
  fetchImmunizations(userId: string): Promise<FhirImmunization[]>;
}
