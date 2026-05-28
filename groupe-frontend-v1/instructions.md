# Instrucciones del Frontend

## Proposito

Aplicacion web Angular para el sistema de diagnostico y mantenimiento vehicular de Grupo NE. La SPA se conecta al backend Spring Boot y usa Keycloak para autenticar tecnicos, managers y administradores.

## Contexto Backend

- API base: `http://localhost:8080/api/v1`
- Keycloak: `http://localhost:8081`
- Realm: `grupone`
- Cliente publico: `maintenance-web`
- Documentacion de endpoints: `./api_endpoint_list.md`

## Reglas de Implementacion

- Usar componentes standalone y lazy loading.
- Mantener servicios HTTP en `src/app/core/services`.
- Mantener modelos en `src/app/core/models`.
- Usar `environment.apiUrl`; no hardcodear URLs de API en componentes.
- En modo real, usar `keycloak-js` y el interceptor HTTP para adjuntar el Bearer token.
- En modo simulacion, usar los datos mock existentes.
- Mantener `/users` solo en modo simulacion hasta que exista `/api/v1/users` en el backend.

## Flujo de Autenticacion

El modo real no usa `/api/v1/auth/login`. La pantalla de login redirige a Keycloak y la sesion vuelve al dashboard con token OIDC.

## Calidad

- Ejecutar `npm run build:real` antes de entregar cambios del frontend.
- Ejecutar pruebas del backend con Maven cuando se cambien configuraciones compartidas.
- Mantener documentacion en espanol.
