# Security and Privacy Architecture

## Data Handling
- PHI is limited to immunization records and demographics stored in PostgreSQL through Prisma.
- Logs should exclude PHI; adjust logging middleware for production deployments.
- Environment variables configure database credentials, OAuth secrets, and SHC signing key locations.

## Key Management
- The SHC signing key is loaded from `SHC_SIGNING_KEY_PATH`. In production, store keys in an HSM or cloud KMS and mount read-only.
- Development includes a helper test key; replace it before real issuance.

## TEFCA Integration
- `TefcaGatewayService` contains TODOs for participant discovery and query flows. When implemented, ensure transport security (TLS) and mutual authentication.

## Hosting Considerations
- Deploy on HIPAA-eligible cloud services with encryption at rest and in transit.
- Restrict database access via network policies and role-based credentials.
- Run Prisma migrations through CI/CD with audit logging.
