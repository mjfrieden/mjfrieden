# White Cloud Medical – VaxPass Architecture

## Overview
The project is a monorepo consisting of a Fastify-style Express backend, a React + Vite frontend, and shared packages for FHIR typings and utilities. The backend offers modular data sources for demo immunization retrieval, SMART Health Card generation, and TEFCA gateway placeholders. The frontend guides users through connecting data sources, syncing immunizations, and generating QR codes.

## Components
- **Backend (apps/backend)**: Express API with routes for auth, data source management, immunization sync, and SHC creation. Prisma handles PostgreSQL persistence.
- **Frontend (apps/frontend)**: React SPA using Material UI with landing, auth, dashboard, data source, and VaxPass pages.
- **Shared packages**: `@whitecloud/fhir-types` defines FHIR resource typings; `@whitecloud/shared-utils` contains normalization helpers.

## Data Flow
1. User authenticates via email/password (demo or registered).
2. After authentication, the frontend calls `/api/sources` to list connectors and `/api/sync` to fetch immunizations.
3. Data sources return normalized FHIR Immunization resources which are cached in PostgreSQL.
4. `/api/shc` builds a SMART Health Card bundle using cached immunizations and signs it using a local ES256 key.
5. Numeric SHC payloads can be rendered as QR codes for wallet import.

## Extensibility
- **Data sources**: Implement the `ImmunizationDataSource` interface in `apps/backend/src/datasources` and register it in `dataSourceRoutes`.
- **TEFCA**: `TefcaGatewayService` is a placeholder where discovery and exchange calls can be implemented.
- **OAuth/OIDC**: Auth routes are ready for extension with health system identity providers; Prisma model `OAuthToken` can store refresh/access tokens.
