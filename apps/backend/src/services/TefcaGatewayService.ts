import { FhirImmunization } from '@whitecloud/fhir-types';

export class TefcaGatewayService {
  async discoverParticipants(): Promise<string[]> {
    return ['MockQHIN', 'DemoProvider'];
  }

  async queryImmunizations(_patientId: string): Promise<FhirImmunization[]> {
    // Future TEFCA/QHIN integration point
    return [];
  }
}
