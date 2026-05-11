# Grupo NE

Repositorio de desarrollo para el sistema de mantenimiento automotriz de Grupo NE.

El entorno local esta preparado para ejecutar la API `grupone`, MongoDB, Keycloak y la base PostgreSQL usada por Keycloak. El `docker-compose.yml` vive en la raiz del repositorio para poder agregar una aplicacion web como otro servicio sin mover la infraestructura compartida.

## Requisitos

- Docker
- Docker Compose
- Java 21 y Maven solo si quieres ejecutar la API fuera de Docker

## Levantar Todos los Servicios

Desde la raiz del repositorio:

```bash
docker compose up -d
```

La API se reconstruye automaticamente cada vez que se ejecuta `docker compose up -d`, porque el servicio `grupone-api` usa `pull_policy: build` y construye la imagen desde `./grupone`.

Para ver el estado de los servicios:

```bash
docker compose ps
```

Para ver logs:

```bash
docker compose logs -f
```

Para detener el entorno:

```bash
docker compose down
```

## Servicios y URLs

| Servicio | URL / Puerto | Uso |
| --- | --- | --- |
| API Grupo NE | `http://localhost:8080` | Backend Spring Boot |
| Swagger UI | `http://localhost:8080/swagger-ui.html` | Documentacion interactiva de la API |
| OpenAPI JSON | `http://localhost:8080/api-docs` | Especificacion OpenAPI |
| Estado de salud | `http://localhost:8080/actuator/health` | Estado de la API |
| Keycloak | `http://localhost:8081` | Servidor de identidad |
| Consola admin Keycloak | `http://localhost:8081` | Usuario `admin`, contrasena `admin` |
| MongoDB | `localhost:27017` | Base de datos de la aplicacion |

## Keycloak

El realm local se llama `grupone` y se importa desde:

```text
keycloak/import/realm-grupone.json
```

La importacion se aplica cuando Keycloak inicia con una base de datos nueva. Si ya existe informacion persistida en PostgreSQL, Keycloak conserva los datos existentes.

Cliente publico para pruebas y para la futura aplicacion web:

```text
maintenance-web
```

Cliente de referencia para la API:

```text
maintenance-backend
```

## Usuarios Demo

| Usuario | Contrasena | Rol |
| --- | --- | --- |
| `viewer` | `viewer123` | `viewer` |
| `manager` | `manager123` | `manager` |
| `admin` | `admin123` | `admin` |

## Probar Autenticacion

Obtener un token con el usuario `admin`:

```bash
ACCESS_TOKEN=$(curl -s -X POST 'http://localhost:8081/realms/grupone/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=maintenance-web' \
  -d 'grant_type=password' \
  -d 'username=admin' \
  -d 'password=admin123' \
  | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).access_token")
```

Llamar un endpoint protegido:

```bash
curl 'http://localhost:8080/api/v1/vehicles' \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Una llamada sin token a `/api/v1/**` debe responder `401`.

## Usar Swagger con Keycloak

Swagger UI esta configurado para aceptar tokens JWT.

1. Abre `http://localhost:8080/swagger-ui.html`.
2. Obtiene un token desde Keycloak usando el ejemplo anterior.
3. Presiona el boton `Authorize` en Swagger UI.
4. Pega el token en el campo `bearerAuth`.
5. Ejecuta los endpoints protegidos desde Swagger.

Pega solo el valor del `access_token`. Swagger agrega el prefijo `Bearer` automaticamente.

## Roles y Permisos

La API valida tokens JWT emitidos por Keycloak mediante un servidor de recursos OAuth2.

Permisos actuales:

- `GET /api/v1/**`: `viewer`, `manager` o `admin`
- `POST /api/v1/**`: `manager` o `admin`
- `PUT /api/v1/**`: `manager` o `admin`
- `PATCH /api/v1/**`: `manager` o `admin`
- `DELETE /api/v1/**`: `admin`

Rutas publicas en desarrollo:

- `/actuator/health`
- `/actuator/info`
- `/api-docs/**`
- `/swagger-ui.html`
- `/swagger-ui/**`

## Persistencia Local

Los datos persistentes quedan fuera de los contenedores:

```text
mongodb/data/
keycloak/postgres/data/
```

Estos directorios estan ignorados por Git para evitar subir datos generados por los servicios. No los borres si quieres conservar la informacion entre reinicios.

## Estructura Relevante

```text
.
├── docker-compose.yml
├── keycloak/
│   ├── import/realm-grupone.json
│   ├── postgres/
│   ├── providers/
│   └── themes/
├── mongodb/
└── grupone/
    ├── Dockerfile
    ├── pom.xml
    └── src/
```

## Notas para Desarrollo

- Ejecuta `docker compose up -d` desde la raiz, no desde `grupone/`.
- La API dentro de Docker se conecta a MongoDB usando `mongodb://mongodb:27017/grupo_ne_maintenance`.
- La validacion JWT usa el emisor publico `http://localhost:8081/realms/grupone` y obtiene las llaves desde Keycloak dentro de la red Docker.
- CORS esta configurado por defecto para `http://localhost:3000`, `http://localhost:5173` y `http://localhost:8080`.
- Cuando se agregue la aplicacion web, se puede incorporar como otro servicio en el `docker-compose.yml` raiz y usar el cliente Keycloak `maintenance-web`.
