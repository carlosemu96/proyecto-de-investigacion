# Maintenance Backend (Grupo NE)

Backend base para el panel de mantenimiento automotriz.

## Stack
- Java 21
- Spring Boot 3.3.x
- MongoDB
- Spring Security (permitAll por ahora)
- OpenAPI/Swagger

## Ejecutar
1. Configura MongoDB (local o remoto):
```bash
export MONGODB_URI='mongodb://localhost:27017/grupo_ne_maintenance'
```
2. Ejecuta:
```bash
mvn spring-boot:run
```

## Endpoints principales
- `GET /api/v1/vehicles`
- `GET /api/v1/spare-parts`
- `GET /api/v1/maintenance-records`
- `GET /api/v1/alerts`
- `GET /api/v1/dashboard/summary`

## Documentación API
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

## Notas de seguridad
`Spring Security` está habilitado pero todos los endpoints están abiertos para acelerar desarrollo inicial.
La base queda preparada para endurecer seguridad e integrar Keycloak en siguientes iteraciones.
