# White Cloud Medical – VaxPass

A full-stack demo for aggregating immunization history, generating SMART Health Cards (SHC), and delivering QR codes for Apple/Google wallet import. The monorepo includes an Express + Prisma backend, a React + Vite frontend, and shared packages for FHIR typings and utilities.

## Monorepo Layout
- `apps/backend`: Express API with Prisma, data source abstractions, TEFCA gateway placeholder, and SHC generation service.
- `apps/frontend`: React UI branded as **White Cloud Medical – VaxPass**.
- `packages/fhir-types`: Shared FHIR typings.
- `packages/shared-utils`: Normalization helpers for immunizations.
- `docs`: Architecture, wallet integration, and security references.

## Getting Started
### Prerequisites
- Node.js 18+
- Docker (for Postgres) or a running PostgreSQL instance

### Installation
```bash
npm install
npm run prisma:generate --workspace apps/backend
```

### Local Development
Start Postgres, backend, and frontend via docker-compose:
```bash
docker-compose up --build
```
Backend runs on `http://localhost:4000`, frontend on `http://localhost:5173`.

Alternatively run manually:
```bash
# Terminal 1
docker compose up db
npm run dev --workspace apps/backend
# Terminal 2
npm run dev --workspace apps/frontend
```

### Environment
Create `.env` in `apps/backend` if overriding defaults:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vaxpass
JWT_SECRET=dev-secret
SHC_SIGNING_KEY_PATH=shc-private-key.pem
```
A minimal ES256 key is generated during tests (`apps/backend/src/tests/shc.test.ts`), but you can place a persistent key at the configured path.

### Demo Workflow
1. Open the frontend and choose **Try Demo Patient** to log in.
2. Navigate to **Data Sources** and click **Connect** on each connector (demo mode is enabled by default).
3. On the Dashboard, click **Sync My Immunizations** to load mock immunization data.
4. Visit **My VaxPass** and click **Generate Smart Health Card** to receive the SHC QR payload. Scan with Apple/Google wallet apps to import.

### Testing
Run backend unit tests:
```bash
npm test --workspace apps/backend
```

## Production Notes
- Replace the signing key and issuer before issuing real SHCs.
- Implement real SMART on FHIR, IIS, pharmacy, or TEFCA connectors by extending `ImmunizationDataSource` implementations in `apps/backend/src/datasources`.
- Harden logging, monitoring, and PHI handling per `docs/security-architecture.md`.
