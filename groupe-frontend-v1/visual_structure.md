# Estructura Visual del Frontend

## Arquitectura

El frontend conserva la estructura de Signal Admin:

```text
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── features/
│   ├── alerts/
│   ├── analytics/
│   ├── auth/
│   ├── dashboard/
│   ├── maintenance/
│   ├── reports/
│   ├── spare-parts/
│   └── vehicles/
├── layouts/
│   ├── auth-layout/
│   └── main-layout/
├── pages/
└── shared/
```

## Navegacion Principal

- Panel de Control: `/dashboard`
- Vehiculos: `/vehicles`
- Mantenimiento: `/maintenance`
- Repuestos: `/spare-parts`
- Alertas: `/alerts`
- Analitica: `/analytics`
- Reportes: `/reports`
- Configuracion: `/settings`
- Perfil: `/profile`

La ruta `/users` se mantiene solo en modo simulacion porque el backend actual no expone endpoints de usuarios.

## Integracion Real

- API: `http://localhost:8080/api/v1`
- Keycloak: `http://localhost:8081`
- Realm: `grupone`
- Cliente: `maintenance-web`
- Redirect URI: `http://localhost:4200/*`
- Web origin: `http://localhost:4200`

## Componentes Esperados

- Dashboard con KPIs, graficos y alertas recientes.
- Gestion de vehiculos con listado, formulario y detalle.
- Gestion de registros de mantenimiento.
- Inventario de repuestos con ajuste de stock por delta.
- Centro de alertas con cambio de estado por query param.
- Analitica y reportes con datos disponibles desde servicios existentes o mocks.

## Criterios de UI

- Usar Angular Material para tablas, formularios, menus y dialogos.
- Usar TailwindCSS solo como utilidades de espaciado, color y layout.
- Mantener el layout principal con sidebar y toolbar.
- No duplicar logica de API en componentes; usar servicios inyectables.
