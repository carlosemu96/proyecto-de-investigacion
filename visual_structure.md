# FRONTEND ROADMAP - INTELLIGENT CONTROL PANEL (ANGULAR)
# Project: Predictive Maintenance Optimization for Automotive Vehicles - Grupo NE
# Base Template: Signal Admin (Angular, Angular Material, TailwindCSS)
# Goal: Integrate new features into the existing signal-admin structure without breaking it.

## CORE PRINCIPLES
- Preserve existing `signal-admin` architecture (core, features, layouts, pages, shared).
- Extend, do not replace. All new code will live in new feature modules or be added to existing ones.
- Follow the established pattern: standalone components, lazy loading, Angular Material + TailwindCSS.
- Use the existing mock API structure (`json-server`) as a foundation, then replace with real backend endpoints.

## PROJECT STRUCTURE (INTEGRATED)

src/
├── app/
│   ├── core/                           # ✅ EXISTS - Keep as is
│   │   ├── models/                     # ➕ ADD new models (Vehicle, Maintenance, SparePart, Alert)
│   │   ├── services/                   # ➕ ADD new API services (vehicle.service, maintenance.service, etc.)
│   │   └── guards/                     # ✅ EXISTS (auth.guard) - Extend roles if needed
│   │
│   ├── features/                       # ✅ EXISTS - MAIN AREA FOR NEW MODULES
│   │   ├── dashboard/                  # ✅ EXISTS - REPLACE with predictive dashboard
│   │   ├── user/                       # ✅ EXISTS - Keep as is (user management)
│   │   ├── admin/                      # ✅ EXISTS - Keep as is
│   │   │
│   │   │   # ➕ NEW FEATURE MODULES (add these folders)
│   │   ├── vehicles/                   # Vehicle registry and management
│   │   ├── maintenance/                # Maintenance records, planning, work orders
│   │   ├── spare-parts/                # Inventory catalog, stock control
│   │   ├── alerts/                     # Real-time and historical alert center
│   │   ├── analytics/                  # Predictive insights, ML visualizations
│   │   └── reports/                    # Custom report builder and exporter
│   │
│   ├── layouts/                        # ✅ EXISTS - Keep as is (auth-layout, main-layout)
│   │   └── main-layout/                # ➕ UPDATE navigation menu with new routes
│   │
│   ├── pages/                          # ✅ EXISTS - Keep as is (login, signup)
│   │   └── login/                      # ✅ Use existing; backend integration will change
│   │
│   └── shared/                         # ✅ EXISTS - Keep as is
│       └── components/                 # ➕ ADD new shared components (confirmation dialog, toast, etc.)
│
├── assets/
│   └── mock-api/                       # ✅ EXISTS - EXTEND db.json with new entities
│
└── environments/                       # ✅ EXISTS - ADD real API endpoints

## ROADMAP BY EXISTING FOLDER

### 1. `core/models/` ➕ ADD NEW INTERFACES
Create files: `vehicle.model.ts`, `maintenance-record.model.ts`, `spare-part.model.ts`, `alert.model.ts`, `dashboard-summary.model.ts`

Example:
```typescript
export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED';
}
```
### 2. core/services/ ➕ ADD NEW API SERVICES
Create files: `vehicle.service.ts`, `maintenance.service.ts`, `spare-part.service.ts`, `alert.service.ts`, `dashboard.service.ts`

All services will use Angular's HttpClient and point to environment.apiUrl.

### 3. core/guards/ ✅ EXTEND (optional)
If role-based access is needed, extend the existing `auth.guard.ts` to check user roles.

### 4. features/dashboard/ 🔄 REPLACE CONTENTS
The existing dashboard will be replaced with an Intelligent Predictive Dashboard containing:

KPI cards (total vehicles, pending maintenance, low stock parts, open alerts)

Real-time charts (maintenance trends by month)

Alerts widget (latest unresolved alerts)

Predictive widget (AI-based failure risk, RUL)

Maintenance calendar (upcoming planned services)

Data sources: DashboardService, AlertService, MaintenanceService

### 5. features/vehicles/ ➕ NEW MODULE
Path: `/vehicles`

Components:
- vehicle-list (table with search, filter, pagination)
- vehicle-form (create/edit)
- vehicle-detail (view with maintenance history)

API Endpoints:
GET `/vehicles`
GET `/vehicles/{id}`
POST `/vehicles`
PUT `/vehicles/{id}`
DELETE `/vehicles/{id}`

### 6. features/maintenance/ ➕ NEW MODULE
Path: `/maintenance`
Sub-routes:
`/planning (schedule new)`
`/calendar (monthly view)`
`/history (past records)`
`/orders/{id} (work order detail)`

Components:
- `maintenance-list`
- `maintenance-form`
- `maintenance-calendar`
- `work-order-view`

API Endpoints:
GET `/maintenance-records?overdue=true/false`
GET `/maintenance-records/{id}`
POST `/maintenance-records`
PUT `/maintenance-records/{id}`
DELETE `/maintenance-records/{id}`

### 7. features/spare-parts/ ➕ NEW MODULE

Path: `/spare-parts`
Components:
- `parts-list (inventory table, low stock highlight)`
- `parts-form (create/edit)`
- `stock-movement (add/remove stock via delta)`

API Endpoints:
GET `/spare-parts`
GET `/spare-parts/{id}`
POST `/spare-parts`
PUT `/spare-parts/{id}`
DELETE `/spare-parts/{id}`
PATCH `/spare-parts/{id}/stock?delta={n}`
GET `/spare-parts/low-stock`

### 8. features/alerts/ ➕ NEW MODULE

Path: `/alerts`
Components:
- `alert-list (filter by status, severity)`
- `alert-detail (view and resolve)`

API Endpoints:
GET `/alerts?openOnly=true/false`
GET `/alerts/{id}`
PATCH `/alerts/{id}/status?status=RESOLVED`
DELETE `/alerts/{id}`

Real-time: Use setInterval polling every 30s to fetch open alerts (or WebSocket if backend supports).

### 9. features/analytics/ ➕ NEW MODULE

Path: `/analytics`
Components:
`predictive-dashboard (AI insights)`
`trend-charts (cost, failure frequency)`
`recommendation-list (suggested actions)`

Data sources: Custom endpoints (to be defined with backend team, e.g., /analytics/failure-prediction). Initially, use mock data.

### 10. features/reports/ ➕ NEW MODULE

Path: `/reports`
Components:
- `report-builder (filters: date range, vehicle, maintenance type)`
- `report-preview (table + chart)`
- `export-options (PDF, Excel, CSV)`

Backend: Will request filtered data from existing endpoints and generate downloadable files.

### 11. layouts/main-layout/ 🔄 UPDATE NAVIGATION MENU
Modify the sidebar component to include links to all new features:

- Vehicles
- Dashboard
- Maintenance
- Spare Parts
- Alerts
- Analytics
- Reports
- Admin (existing)
- User Management (existing)

## 12. shared/components/ ➕ ADD REUSABLE UI
- `confirmation-dialog.component` (for delete actions)
- `toast.component` (for success/error messages)
- `loading-spinner.component` (global HTTP interceptor loading indicator)
- `empty-state.component` (for lists with no data)

### 13. assets/mock-api/db.json 🔄 EXTEND
Add mock data for:

vehicles (array)

maintenanceRecords (array)

spareParts (array)

alerts (array)

dashboardSummary (object)

Update json-server routes if necessary.

### 14. environments/ ➕ ADD REAL ENDPOINTS
typescript
```
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',  // Real backend
  wsUrl: 'ws://localhost:8080/ws',         // For real-time (optional)
  mockApiUrl: 'http://localhost:3000',     // Keep for mock fallback
  appName: 'Signal Admin - Grupo NE',
  version: '2.0.0'
};
```

### SPRINT PLAN (INTEGRATION ORDER)
## Sprint 1: Setup & Core Extension

Extend db.json with new mock entities

Add new models to core/models

Add new API services to core/services

Create shared components (dialog, toast)

## Sprint 2: Dashboard & Vehicles

Replace features/dashboard with predictive dashboard

Implement features/vehicles (CRUD)

Update navigation menu

## Sprint 3: Maintenance & Spare Parts

Implement features/maintenance

Implement features/spare-parts

Integrate stock movement and low stock alerts

## Sprint 4: Alerts & Real-time

Implement features/alerts

Add polling or WebSocket for live alerts

Link alerts to vehicles and maintenance records

## Sprint 5: Analytics & Reports

Implement features/analytics (mock ML data initially)

Implement features/reports (filtering and export)

## Sprint 6: Testing & Backend Integration

Replace mock API calls with real backend endpoints

Test authentication with real JWT

Final responsive polish

### AUTHENTICATION INTEGRATION NOTE
The existing mock login (admin@example.com / admin123) will be replaced with real backend authentication:

Endpoint: POST `/api/v1/auth/login`

Response: `{ token: string, user: { id, name, email, role } }`

Store token in localStorage or HttpOnly cookie (backend-dependent)

Update auth.guard to check token validity

The `core/services/auth.service.ts` will be modified accordingly, but its interface (login, logout, isLoggedIn) should remain the same to avoid breaking existing components.

### TESTING & QUALITY
Unit tests: Use existing Karma/Jasmine setup. Add tests for new services and components.

Linting: npm run lint (ensure new code passes)

Build: npm run build (must complete without errors)

### DOCUMENTATION FOR AI AGENT
Follow the standalone component pattern exactly as in Signal Admin.

Use Angular Material components for tables, dialogs, forms.

Use TailwindCSS for additional spacing, colors, and responsive utilities.

All new routes must be lazy-loaded.

Do not modify features/user or features/admin unless explicitly required.

The existing pages/login and pages/signup will be kept but their authentication logic will be replaced.

### RESTRICTIONS (WHAT TO AVOID)
Do not delete or rename any existing folder inside app/core, app/layouts, or app/pages.

Do not change the existing main-layout component's basic HTML structure unless adding menu items.

Do not convert existing standalone components to non-standalone.

Do not remove the mock API setup until the real backend is fully integrated.

### END STATE
A fully functional predictive maintenance dashboard that:

Respects the original Signal Admin visual identity.

Extends the template with new business features.

Is ready to connect to a Spring Boot backend.

Maintains responsive design for desktop and mobile.

### FINAL NOTE FOR CONTINUE AGENT
When generating code, always reference the existing Signal Admin code style. For any new component, use the same pattern as features/user/user-list.component.ts (standalone, imports array, inline template or separate file). Place API calls inside services, not in components. Use dependency injection throughout.

This roadmap ensures zero disruption to the existing Signal Admin template while adding all required functionality for the predictive maintenance project.

