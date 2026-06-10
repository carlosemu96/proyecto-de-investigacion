# AGENTS.md

Grupo NE automotive maintenance system. Two apps in one repo, wired together by the root `docker-compose.yml`.

- `grupone/` — Spring Boot 3.3 + Java 21 backend (`maintenance-backend`), MongoDB, OAuth2 resource server.
- `groupe-frontend-v1/` — Angular 20 SPA (npm name `signal-admin`), Tailwind, Keycloak auth.
- `keycloak/`, `mongodb/` — service config + local persisted data.

The README directory tree is slightly stale; the two app dir names above are authoritative. Docs are written in Spanish — keep new docs in Spanish.

## Run the whole stack

```bash
docker compose up -d            # from repo root, NOT from grupone/
```

API and frontend images use `pull_policy: build`, so they rebuild on every `up -d`. To force a clean frontend rebuild (browser caching is common because Nginx serves hashed bundles):

```bash
docker compose build --no-cache grupone-frontend
docker compose up -d --force-recreate grupone-frontend
```

Services: frontend `:4200`, API `:8080`, Swagger `:8080/swagger-ui.html`, Keycloak `:8081` (admin/admin), MongoDB `:27017`.

## Backend (`grupone/`)

- No Maven wrapper (`mvnw`) exists — use system `mvn` (needs Java 21).
- Build / test: `mvn package` / `mvn test` (one real test: `SparePartServiceTest`).
- Run outside Docker requires Mongo + Keycloak already up, plus env vars:
  ```bash
  export MONGODB_URI='mongodb://localhost:27017/grupo_ne_maintenance'
  export KEYCLOAK_ISSUER_URI='http://localhost:8081/realms/grupone'
  mvn spring-boot:run
  ```
- Inside Docker the JWK set is fetched via the internal host `keycloak:8080`, while the issuer stays the public `localhost:8081` — do not unify these.
- Layout: `controller/ service/ repository/ model/ dto/ config/ exception/`. Security rules live in `config/SecurityConfig.java`.
- Auth by HTTP verb: `GET` = viewer/manager/admin, `POST/PUT/PATCH` = manager/admin, `DELETE` = admin. Public: actuator health/info, `/api-docs/**`, swagger.

## Frontend (`groupe-frontend-v1/`)

- Build for delivery: `npm run build:real` (this is what the Dockerfile runs). `build:mock` uses local mock data.
- The `mock`/`real`/`production` build configs swap `environments/environment.ts` via file replacement (`environment.mock.ts` / `environment.real.ts`). Never hardcode API/Keycloak URLs; use `environment.*`.
- `npm test` and `npm run lint` are NOT functional: there are no `.spec.ts` files, no `tsconfig.spec.json`, and no ESLint config/dependency installed. Don't rely on them — verify with `npm run build:real`.
- Dev servers: `npm run start:mock` (json-server data) or `npm run start:real` (live API + Keycloak redirect login). Mock API: `npm run api` (json-server on `:3000`).
- Conventions (from `instructions.md`): standalone components + lazy loading; HTTP services in `src/app/core/services`; models in `src/app/core/models`; in real mode use `keycloak-js` + HTTP interceptor for the Bearer token. Keep `/users` mock-only until `/api/v1/users` exists.

## Keycloak

- Realm `grupone` imported from `keycloak/import/realm-grupone.json`, but only on a fresh Postgres DB. If `keycloak/postgres/data` already has data, the realm import is skipped — edit via admin console or wipe local data.
- Public client `maintenance-web` (frontend), reference client `maintenance-backend`.
- Demo users: `viewer/viewer123`, `manager/manager123`, `admin/admin123`.

## Data persistence

`mongodb/data/`, `keycloak/postgres/data/`, and `backups/` are gitignored. Don't delete them if you want to keep state between restarts.
