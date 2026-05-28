# Especificacion de API del Panel Grupo NE

Este documento resume los endpoints del backend REST usados por el frontend Angular.

## Configuracion Base

- URL base: `http://localhost:8080/api/v1`
- Autenticacion real: Bearer token emitido por Keycloak `http://localhost:8081`, realm `grupone`, cliente `maintenance-web`
- Content-Type: `application/json`
- Accept: `*/*`

## Modelos TypeScript

```typescript
export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  status: string;
}

export interface SparePart {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitCost: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'PREVENTIVE' | 'CORRECTIVE';
  plannedDate: string;
  completedDate: string;
  mileageAtService: number;
  totalCost: number;
  sparePartIds: string[];
  status: string;
  notes: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  vehicleId: string;
  maintenanceRecordId: string;
  severity: string;
  status: 'OPEN' | 'RESOLVED' | string;
  createdAt: string;
  resolvedAt: string;
}

export interface DashboardSummary {
  totalVehicles: number;
  totalMaintenanceRecords: number;
  plannedMaintenances: number;
  inProgressMaintenances: number;
  completedMaintenances: number;
  lowStockParts: number;
  totalAlerts: number;
}
```

## Endpoints

### Vehiculos (`/vehicles`)

| Metodo | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/vehicles` | No aplica | `Vehicle[]` |
| `GET` | `/vehicles/{id}` | No aplica | `Vehicle` |
| `POST` | `/vehicles` | `Vehicle` sin `id` | `Vehicle` |
| `PUT` | `/vehicles/{id}` | `Vehicle` | `Vehicle` |
| `DELETE` | `/vehicles/{id}` | No aplica | `void` |

### Repuestos (`/spare-parts`)

| Metodo | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/spare-parts` | No aplica | `SparePart[]` |
| `GET` | `/spare-parts/{id}` | No aplica | `SparePart` |
| `GET` | `/spare-parts/low-stock` | No aplica | `SparePart[]` |
| `POST` | `/spare-parts` | `SparePart` sin `id` | `SparePart` |
| `PUT` | `/spare-parts/{id}` | `SparePart` | `SparePart` |
| `PATCH` | `/spare-parts/{id}/stock?delta={number}` | No aplica | `SparePart` |
| `DELETE` | `/spare-parts/{id}` | No aplica | `void` |

### Registros de Mantenimiento (`/maintenance-records`)

| Metodo | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/maintenance-records?overdue={boolean}` | No aplica | `MaintenanceRecord[]` |
| `GET` | `/maintenance-records/{id}` | No aplica | `MaintenanceRecord` |
| `POST` | `/maintenance-records` | `MaintenanceRecord` | `MaintenanceRecord` |
| `PUT` | `/maintenance-records/{id}` | `MaintenanceRecord` | `MaintenanceRecord` |
| `DELETE` | `/maintenance-records/{id}` | No aplica | `void` |

### Alertas (`/alerts`)

| Metodo | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/alerts?openOnly={boolean}` | No aplica | `Alert[]` |
| `GET` | `/alerts/{id}` | No aplica | `Alert` |
| `POST` | `/alerts` | `Alert` sin `id` | `Alert` |
| `PATCH` | `/alerts/{id}/status?status={string}` | No aplica | `Alert` |
| `DELETE` | `/alerts/{id}` | No aplica | `void` |

### Dashboard (`/dashboard`)

| Metodo | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/dashboard/summary` | No aplica | `DashboardSummary` |

## Directrices de Integracion Angular

1. Usar `environment.apiUrl` para la URL base.
2. Usar `HttpClient` con `Observable<T>`.
3. En modo real, adjuntar `Authorization: Bearer <token>` desde `KeycloakService`.
4. Enviar `delta` y `status` como query params en los endpoints `PATCH`; no enviar body JSON.
5. Mantener `/users` fuera del modo real hasta que exista `/api/v1/users` en el backend.
