# AI INSTRUCTIONS - FRONTEND APPLICATION

## 1. Project Purpose
Build the **frontend web application** for Grupo NE's vehicle maintenance diagnostic system. This SPA connects to an existing backend API (Spring Boot + Keycloak) and provides an intuitive interface for technicians, managers, and admins to manage vehicles, maintenance, inventory, and view AI-powered predictions.

## 2. Backend Context (Already Built)
- **API Base URL**: `http://localhost:8080/api/v1`
- **Authentication**: Keycloak (OAuth2 / OpenID Connect)
- **Documentation**: Find doc of endpoints in: `./api_endpoints_list.md`
- **Auth Flow**: Password grant type with JWT tokens

## 3. Mandatory Paradigms
- **Architecture**: Modular SPA with Angular components
- **State Management**: RxJS BehaviorSubjects for real-time data
- **Authentication**: OAuth2 implicit/password flow with Keycloak
- **API Communication**: HTTP interceptors for JWT injection
- **Styling**: Responsive design (mobile/desktop) with Angular Signal Admin
- **Fake Payloads**: With information provided in: `./api_endpoints_list.md`, create different fake payloads to populate frontend, emulating final response from API

## 4. Technology Stack

- **Framework**: Angular, already installed in folder
- **UI Library**: Angular Signal Admin Panel, already installed
- **HTTP Client**: Angular HttpClient with interceptors
- **Auth Client**: Keycloak-js or @auth0/angular-jwt
- **State Management**: RxJS BehaviorSubject
- **Charts**: Chart.js or ngx-charts

## 5. Use keycloak for AUTH
- Use keycloak to generate and take care of tokens sent down to API request in angular
- Dedicate a whole feature for this

## 6. Code Style Rules
- **TypeScript strict mode**: No `any` type (use `unknown` if needed)
- **Modular components**: One component per file, single responsibility
- **RxJS**: Use `takeUntil` for unsubscribe, avoid nested subscriptions
- **Services**: Singleton services for API calls and state management
- **Styling**: Use existing components and styles from `./src/app/features` to build the markup for the different views 
- **Commenting**: Comment every method/code bit with short and easy to follow explanations

## 7. Prohibited Code
- `any` type (use proper interfaces)
- `console.log` in production (use Angular logger service)
- Business logic in components (keep in services)
- Direct localStorage access outside auth service
- Hardcoded API URLs (use environment files)

## 8. Workflow Before Writing ANY Code
1. Read `README.md` - Understand current folder structure
2. Read `instructions.md` - know big picture
3. Read `api_endpoint_list.md` - Understand the the API endpoints that will be used on the project
4. Read `visual_structure.md` - Know File names and main visual components to create and modify
5. **Confirm plan in max 5 lines before coding**