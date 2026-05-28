INTELLIGENT DASHBOARD API SPECIFICATION

This document provides a structured, machine-readable specification of the backend REST API. It is optimized for AI coding agents to quickly understand the endpoints and generate the corresponding Angular services, models, and state management logic for the intelligent control panel based on predictive analysis.

Base Configuration:
- Base URL: `http://localhost:8080/api/v1`
- Content-Type: application/json
- Accept: `*/*`

===============================================================================
1. TYPESCRIPT DATA MODELS
===============================================================================
These interfaces should be generated in the Angular project to type-check HTTP payloads and responses.

```
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
  plannedDate: string; // ISO Date (YYYY-MM-DD)
  completedDate: string; // ISO Date (YYYY-MM-DD)
  mileageAtService: number;
  totalCost: number;
  sparePartIds: string[];
  status: string;
  notes: string;
  createdAt: string; // ISO DateTime
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  vehicleId: string;
  maintenanceRecordId: string;
  severity: string;
  status: 'OPEN' | 'RESOLVED' | string;
  createdAt: string; // ISO DateTime
  resolvedAt: string; // ISO DateTime
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

===============================================================================
2. API ENDPOINTS REFERENCE
===============================================================================

2.1 Vehicles Controller (`/vehicles`)
----------------------------------------
- GET `/vehicles`
  Description: Retrieve all vehicles.
  Body: N/A
  Response: Vehicle[]

- GET `/vehicles/{id}`
  Description: Retrieve a specific vehicle by ID.
  Body: N/A
  Response: Vehicle

- POST `/vehicles`
  Description: Create a new vehicle.
  Body: Vehicle (omit ID)
  Response: Vehicle

- PUT `/vehicles/{id}`
  Description: Update an existing vehicle.
  Body: Vehicle
  Response: Vehicle

- DELETE `/vehicles/{id}`
  Description: Delete a vehicle.
  Body: N/A
  Response: void (200/204 OK)


2.2 Spare Parts Controller (`/spare-parts`)
-------------------------------------------
- GET `/spare-parts`
  Description: Retrieve all spare parts.
  Body: N/A
  Response: SparePart[]

- GET `/spare-parts/{id}`
  Description: Retrieve a specific spare part.
  Body: N/A
  Response: SparePart

- GET `/spare-parts/low-stock`
  Description: Retrieve spare parts where stock <= minStock.
  Body: N/A
  Response: SparePart[]

- POST `/spare-parts`
  Description: Create a new spare part.
  Body: SparePart (omit ID)
  Response: SparePart

- PUT `/spare-parts/{id}`
  Description: Update an existing spare part.
  Body: SparePart
  Response: SparePart

- PATCH `/spare-parts/{id}/stock?delta={number}`
  Description: Adjust stock by a delta value (e.g., ?delta=1 or ?delta=-1).
  Body: N/A
  Response: SparePart

- DELETE `/spare-parts/{id}`
  Description: Delete a spare part.
  Body: N/A
  Response: void


2.3 Maintenance Records Controller (`/maintenance-records`)
-------------------------------------------------------------------
- GET `/maintenance-records?overdue={boolean}`
  Description: Retrieve maintenance records (optional filter for overdue).
  Body: N/A
  Response: MaintenanceRecord[]

- GET `/maintenance-records/{id}`
  Description: Retrieve a specific record.
  Body: N/A
  Response: MaintenanceRecord

- POST `/maintenance-records`
  Description: Create a maintenance record.
  Body: MaintenanceRecord
  Response: MaintenanceRecord

- PUT `/maintenance-records/{id}`
  Description: Update a maintenance record.
  Body: MaintenanceRecord
  Response: MaintenanceRecord

- DELETE `/maintenance-records/{id}`
  Description: Delete a maintenance record.
  Body: N/A
  Response: void


2.4 Alerts Controller (`/alerts`)
-------------------------------------
- GET `/alerts?openOnly={boolean}`
  Description: Retrieve alerts (optional filter for open only).
  Body: N/A
  Response: Alert[]

- GET `/alerts/{id}`
  Description: Retrieve a specific alert.
  Body: N/A
  Response: Alert

- POST `/alerts`
  Description: Create a new alert.
  Body: Alert (omit ID)
  Response: Alert

- PATCH `/alerts/{id}/status?status={string}`
  Description: Update the status of an alert (e.g., ?status=OPEN).
  Body: N/A
  Response: Alert

- DELETE `/alerts/{id}`
  Description: Delete an alert.
  Body: N/A
  Response: void


2.5 Dashboard Controller (`/dashboard`)
------------------------------------------------
- GET `/dashboard/summary`
  Description: Retrieve aggregated metrics for the intelligent dashboard.
  Body: N/A
  Response: DashboardSummary

===============================================================================
3. ANGULAR INTEGRATION DIRECTIVES (FOR AI AGENT)
===============================================================================
When implementing the frontend for these endpoints:
1. Generate Services: Create a dedicated Angular service for each controller (e.g., VehicleService, SparePartService, MaintenanceService, AlertService, DashboardService).
2. Environment Variables: Map the base URL `http://localhost:8080/api/v1` to environment.apiUrl.
3. HttpClient: Use Angular's HttpClient returning Observable<T> types.
4. Query Parameters: Use HttpParams for endpoints with filters like /alerts?openOnly=false, /spare-parts/{id}/stock?delta=1, and /maintenance-records?overdue=false.
5. State Management: Consider using Angular Signals or RxJS BehaviorSubjects to manage the global state of the DashboardSummary and active alerts, enabling real-time UI updates.