export interface FhirIdentifier {
  system?: string;
  value?: string;
}

export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirCodeableConcept {
  coding?: FhirCoding[];
  text?: string;
}

export interface FhirReference {
  reference?: string;
  display?: string;
}

export interface FhirImmunization {
  resourceType: 'Immunization';
  id?: string;
  status: string;
  vaccineCode: FhirCodeableConcept;
  patient: FhirReference;
  occurrenceDateTime?: string;
  lotNumber?: string;
  performer?: { actor: FhirReference }[];
  manufacturer?: FhirReference;
  protocolApplied?: {
    series?: string;
    targetDisease?: FhirCodeableConcept[];
    doseNumberString?: string;
  }[];
}

export interface FhirPatient {
  resourceType: 'Patient';
  id?: string;
  identifier?: FhirIdentifier[];
  name?: { given?: string[]; family?: string }[];
  birthDate?: string;
  gender?: string;
  address?: { line?: string[]; city?: string; state?: string; postalCode?: string; country?: string }[];
}

export interface ShcBundle {
  resourceType: 'Bundle';
  type: 'collection';
  entry: { resource: FhirPatient | FhirImmunization }[];
}
