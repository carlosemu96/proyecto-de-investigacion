# Backend de Mantenimiento (Grupo NE)

Backend base para el panel de mantenimiento automotriz.

## Tecnologias

- Java 21
- Spring Boot 3.3.x
- MongoDB
- Spring Security como servidor de recursos OAuth2
- Keycloak
- OpenAPI / Swagger

## Ejecucion Recomendada

El entorno Docker Compose vive en la raiz del repositorio para soportar la API, servicios compartidos y la futura aplicacion web.

Desde la raiz del repositorio:

```bash
docker compose up -d
```

La imagen de esta API se reconstruye automaticamente en cada `docker compose up -d`.

Servicios principales:

- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Keycloak: `http://localhost:8081`
- MongoDB: `localhost:27017`

## Ejecutar Solo la API Fuera de Docker

Si necesitas ejecutar la API localmente con Maven, primero debes tener MongoDB y Keycloak disponibles. Puedes levantarlos con Docker Compose desde la raiz y luego ejecutar:

```bash
export MONGODB_URI='mongodb://localhost:27017/grupo_ne_maintenance'
export KEYCLOAK_ISSUER_URI='http://localhost:8081/realms/grupone'
mvn spring-boot:run
```

## Endpoints Principales

- `GET /api/v1/vehicles`
- `GET /api/v1/spare-parts`
- `GET /api/v1/maintenance-records`
- `GET /api/v1/alerts`
- `GET /api/v1/dashboard/summary`

## Seguridad

La API valida tokens JWT emitidos por Keycloak.

Permisos actuales:

- `GET /api/v1/**`: `viewer`, `manager` o `admin`
- `POST`, `PUT`, `PATCH /api/v1/**`: `manager` o `admin`
- `DELETE /api/v1/**`: `admin`

Rutas publicas en desarrollo:

- `/actuator/health`
- `/actuator/info`
- `/api-docs/**`
- `/swagger-ui.html`
- `/swagger-ui/**`

## Usuarios Demo

Realm Keycloak: `grupone`

| Usuario | Contrasena | Rol |
| --- | --- | --- |
| `viewer` | `viewer123` | `viewer` |
| `manager` | `manager123` | `manager` |
| `admin` | `admin123` | `admin` |

Cliente publico para pruebas y para la futura aplicacion web: `maintenance-web`.

## Obtener un Token de Prueba

```bash
curl -X POST 'http://localhost:8081/realms/grupone/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=maintenance-web' \
  -d 'grant_type=password' \
  -d 'username=admin' \
  -d 'password=admin123'
```

Luego usa el `access_token` como token portador:

```bash
curl 'http://localhost:8080/api/v1/vehicles' \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Configuracion Relevante

- `MONGODB_URI`: URI de MongoDB.
- `KEYCLOAK_ISSUER_URI`: emisor publico del realm Keycloak.
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI`: URL interna para obtener llaves JWT cuando corre en Docker.
- `APP_CORS_ALLOWED_ORIGINS`: origenes permitidos por CORS separados por coma.
