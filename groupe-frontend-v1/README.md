# Grupo NE — Mantenimiento Predictivo de Flota

Frontend Angular para el sistema de gestión y mantenimiento predictivo de flota vehicular de Grupo NE.

---

## Estado del proyecto

| Módulo | Estado |
|---|---|
| Panel de Control (KPIs + gráficos) | Completo — datos simulados |
| Gestión de Vehículos (CRUD) | Completo — datos simulados |
| Registros de Mantenimiento (CRUD) | Completo — datos simulados |
| Inventario de Repuestos (CRUD + ajuste de stock) | Completo — datos simulados |
| Alertas (polling cada 30 s) | Completo — datos simulados |
| Analítica (riesgo IA + gráficos de costo) | Completo — datos simulados |
| Reportes (filtros + exportar CSV) | Completo — datos simulados |
| Autenticación Keycloak | Integrado — listo para conectar |
| Integración API real (Spring Boot) | Listo — activar con `npm run start:real` |
| Exportación PDF | Pendiente — stub implementado |

> **Todos los módulos funcionan con datos simulados de forma predeterminada.**
> La integración con la API real y Keycloak se activa mediante una variable de entorno (`useMockData: false`).

---

## Tecnologías

- **Angular 20** — componentes standalone, lazy loading, Signals
- **Angular Material** — componentes UI
- **TailwindCSS 3** — utilidades CSS
- **Chart.js** — gráficos del dashboard y analítica
- **keycloak-js 26** — autenticación OAuth2 con Keycloak
- **RxJS 7** — streams reactivos, polling de alertas

---

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- *(Opcional para modo real)* Spring Boot API en `http://localhost:8080/api/v1`
- *(Opcional para modo real)* Keycloak en `http://localhost:8081` con realm `grupone` y cliente `maintenance-web`

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd groupe-frontend-v1

# Instalar dependencias
npm install
```

---

## Cómo iniciar

El proyecto tiene dos modos de funcionamiento controlados por el archivo de entorno que se carga en el build.

### Modo simulación (recomendado para desarrollo)

No requiere backend ni Keycloak. Todos los datos son locales.

```bash
npm start
# o explícitamente:
npm run start:mock
```

La aplicación estará disponible en `http://localhost:4200`.

Para iniciar sesión en modo simulación, use cualquier correo y contraseña (mínimo 6 caracteres):

```
Correo:    admin@grupone.com
Contraseña: cualquier6chars
```

### Modo API real

Requiere el backend Spring Boot y Keycloak corriendo.

```bash
npm run start:real
```

En este modo:
- La autenticación redirige al servidor Keycloak
- Todos los pedidos HTTP llevan el token Bearer de Keycloak en el header `Authorization`
- Los servicios llaman a la API real en `http://localhost:8080/api/v1`

---

## Variables de entorno y comportamiento

El comportamiento de la aplicación se controla con el campo `useMockData` en los archivos de entorno ubicados en `environments/`.

### `environments/environment.ts` — Desarrollo (mock activado por defecto)

```typescript
export const environment = {
  production: false,
  useMockData: true,           // <-- controla todo el comportamiento
  apiUrl: 'http://localhost:8080/api/v1',
  keycloakUrl: 'http://localhost:8081',
  keycloakRealm: 'grupone',
  keycloakClientId: 'maintenance-web',
  ...
};
```

### `environments/environment.mock.ts` — Simulación explícita

Idéntico al anterior. Se usa al ejecutar `npm run start:mock` o `npm run build:mock`.

### `environments/environment.real.ts` — API real

```typescript
export const environment = {
  production: false,
  useMockData: false,          // <-- desactiva datos simulados
  apiUrl: 'http://localhost:8080/api/v1',
  keycloakUrl: 'http://localhost:8081',
  keycloakRealm: 'grupone',
  keycloakClientId: 'maintenance-web',
  ...
};
```

### Tabla de comportamientos según `useMockData`

| Característica | `useMockData: true` | `useMockData: false` |
|---|---|---|
| Datos de vehículos | `of(MOCK_VEHICLES)` | `GET /api/v1/vehicles` |
| Datos de mantenimiento | `of(MOCK_MAINTENANCE_RECORDS)` | `GET /api/v1/maintenance-records` |
| Datos de repuestos | `of(MOCK_SPARE_PARTS)` | `GET /api/v1/spare-parts` |
| Alertas | `of(MOCK_ALERTS)` | `GET /api/v1/alerts` |
| Dashboard | `of(MOCK_DASHBOARD_SUMMARY)` | `GET /api/v1/dashboard/summary` |
| Autenticación | Formulario local (mock) | Redirección a Keycloak |
| Token en requests | No se adjunta | `Authorization: Bearer <token>` |
| Inicialización Keycloak | Saltada | `APP_INITIALIZER` llama `keycloak.init()` |
| Guard de rutas | `AuthService.isAuthenticated()` | `KeycloakService.isLoggedIn()` |

---

## Scripts disponibles

```bash
npm start              # Inicia en modo simulación (alias de start:mock)
npm run start:mock     # Inicia con environment.mock.ts (useMockData: true)
npm run start:real     # Inicia con environment.real.ts (useMockData: false)

npm run build          # Build de producción (environment.prod.ts)
npm run build:mock     # Build con datos simulados
npm run build:real     # Build con API real

npm run api            # Inicia json-server en puerto 3000 (datos de respaldo)
npm run test           # Ejecuta tests unitarios
npm run lint           # Ejecuta ESLint
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Mock o Keycloak según useMockData
│   │   ├── interceptors/
│   │   │   └── api.interceptor.ts     # Inyecta token Bearer en modo real
│   │   ├── models/                    # Interfaces TypeScript + constantes MOCK_*
│   │   │   ├── vehicle.model.ts
│   │   │   ├── maintenance-record.model.ts
│   │   │   ├── spare-part.model.ts
│   │   │   ├── alert.model.ts
│   │   │   └── dashboard-summary.model.ts
│   │   └── services/                  # Servicios con switch mock/real
│   │       ├── vehicle.service.ts
│   │       ├── maintenance.service.ts
│   │       ├── spare-part.service.ts
│   │       ├── alert.service.ts
│   │       └── dashboard.service.ts
│   ├── features/
│   │   ├── auth/
│   │   │   └── keycloak.service.ts    # Wrapper de keycloak-js
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── maintenance/
│   │   ├── spare-parts/
│   │   ├── alerts/
│   │   ├── analytics/
│   │   └── reports/
│   ├── layouts/
│   │   ├── auth-layout/               # Layout para login/signup
│   │   └── main-layout/               # Layout principal con sidebar
│   ├── pages/
│   │   ├── login/                     # Login con Keycloak o formulario mock
│   │   └── signup/
│   └── shared/
│       └── components/                # EmptyState, LoadingSpinner, ConfirmationDialog
├── environments/
│   ├── environment.ts                 # Dev (mock activado)
│   ├── environment.mock.ts            # Simulación explícita
│   ├── environment.real.ts            # API real + Keycloak
│   └── environment.prod.ts            # Producción
└── main.ts                            # Bootstrap + APP_INITIALIZER Keycloak
```

---

## Configuración de Keycloak (modo real)

Para usar `npm run start:real`, el servidor Keycloak debe estar configurado con:

| Parámetro | Valor |
|---|---|
| URL del servidor | `http://localhost:8081` |
| Realm | `grupone` |
| Client ID | `maintenance-web` |
| Client Protocol | `openid-connect` |
| Access Type | `public` |
| Valid Redirect URIs | `http://localhost:4200/*` |
| Web Origins | `http://localhost:4200` |

El flujo de autenticación es `check-sso` — si el usuario ya tiene sesión activa en Keycloak, se restaura automáticamente sin redirigir.

Si Keycloak ya tiene datos persistidos en `../keycloak/postgres/data`, los cambios del archivo de importación del realm no se aplican automáticamente. Actualice el cliente `maintenance-web` desde la consola admin o recree la data local si no necesita conservarla.

---

## Endpoints de la API (modo real)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/vehicles` | Listar vehículos |
| `POST` | `/api/v1/vehicles` | Crear vehículo |
| `PUT` | `/api/v1/vehicles/:id` | Actualizar vehículo |
| `DELETE` | `/api/v1/vehicles/:id` | Eliminar vehículo |
| `GET` | `/api/v1/maintenance-records` | Listar registros |
| `POST` | `/api/v1/maintenance-records` | Crear registro |
| `PUT` | `/api/v1/maintenance-records/:id` | Actualizar registro |
| `DELETE` | `/api/v1/maintenance-records/:id` | Eliminar registro |
| `GET` | `/api/v1/spare-parts` | Listar repuestos |
| `POST` | `/api/v1/spare-parts` | Crear repuesto |
| `PUT` | `/api/v1/spare-parts/:id` | Actualizar repuesto |
| `PATCH` | `/api/v1/spare-parts/:id/stock?delta={n}` | Ajustar stock |
| `DELETE` | `/api/v1/spare-parts/:id` | Eliminar repuesto |
| `GET` | `/api/v1/alerts` | Listar alertas |
| `PATCH` | `/api/v1/alerts/:id/status?status={estado}` | Cambiar estado |
| `DELETE` | `/api/v1/alerts/:id` | Eliminar alerta |
| `GET` | `/api/v1/dashboard/summary` | Resumen de KPIs |

---

## Pendientes conocidos

- **Exportación PDF** — el botón muestra un snackbar; integrar `jsPDF` o endpoint backend
- **Página de detalle de vehículo** — agregar enlace desde la lista de vehículos a `/vehicles/:id`
- **Remover Puppeteer** — `test-app.mjs` y la devDependency de `puppeteer` pueden eliminarse
- **Usuarios** — la ruta `/users` queda disponible solo en modo simulación; el backend actual no expone `/api/v1/users`
