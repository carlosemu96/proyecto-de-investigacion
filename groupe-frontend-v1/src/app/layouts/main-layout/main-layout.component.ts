import { Component, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/auth.model';
import { KeycloakService } from '../../features/auth/keycloak.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <!-- Barra lateral -->
      <mat-sidenav #sidenav mode="side" [(opened)]="sidebarOpened" class="w-64 transition-all duration-300 bg-white">
        <!-- Marca -->
        <div class="flex items-center h-16 px-4 border-b border-gray-200">
          <mat-icon class="text-2xl text-primary-600 mr-2">signal_cellular_alt</mat-icon>
          <span class="text-xl font-bold text-gray-900">Grupo NE</span>
        </div>
        <!-- Menú de navegación -->
        <mat-nav-list class="p-0">

          <!-- Panel de control -->
          <a mat-list-item routerLink="/dashboard" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Panel de Control</span>
          </a>

          <!-- Gestión de flota -->
          <mat-expansion-panel class="!shadow-none !bg-transparent !border-none !m-0 !p-0" expanded>
            <mat-expansion-panel-header>
              <mat-panel-title class="flex items-center">
                <mat-icon class="mr-2">directions_car</mat-icon>
                Flota
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-nav-list class="p-0">
              <a mat-list-item routerLink="/vehicles" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Vehículos
              </a>
              <a mat-list-item routerLink="/maintenance" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Mantenimiento
              </a>
              <a mat-list-item routerLink="/spare-parts" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Repuestos
              </a>
            </mat-nav-list>
          </mat-expansion-panel>

          <!-- Monitoreo -->
          <mat-expansion-panel class="!shadow-none !bg-transparent !border-none !m-0 !p-0" expanded>
            <mat-expansion-panel-header>
              <mat-panel-title class="flex items-center">
                <mat-icon class="mr-2">notifications_active</mat-icon>
                Monitoreo
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-nav-list class="p-0">
              <a mat-list-item routerLink="/alerts" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Alertas
              </a>
              <a mat-list-item routerLink="/analytics" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Analítica
              </a>
              <a mat-list-item routerLink="/reports" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Reportes
              </a>
            </mat-nav-list>
          </mat-expansion-panel>

          <!-- Opciones -->
          <mat-expansion-panel class="!shadow-none !bg-transparent !border-none !m-0 !p-0" expanded>
            <mat-expansion-panel-header>
              <mat-panel-title class="flex items-center">
                <mat-icon class="mr-2">tune</mat-icon>
                Opciones
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-nav-list class="p-0">
              <a mat-list-item routerLink="/settings" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Configuración
              </a>
              <a mat-list-item routerLink="/profile" routerLinkActive="bg-primary-50 text-primary-600" class="!px-2 !py-1 w-full">
                Perfil
              </a>
            </mat-nav-list>
          </mat-expansion-panel>

        </mat-nav-list>
      </mat-sidenav>

      <!-- Contenido principal -->
      <mat-sidenav-content class="flex flex-col flex-1 min-w-0">
        <!-- Encabezado -->
        <mat-toolbar color="primary" class="flex items-center justify-between">
          <div class="flex items-center">
            <button mat-icon-button (click)="sidebarOpened = !sidebarOpened">
              <mat-icon>menu</mat-icon>
            </button>
            <h1 class="text-xl font-semibold ml-4">{{ pageTitle() }}</h1>
          </div>
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-primary-700 transition cursor-pointer" [matMenuTriggerFor]="userMenu">
              <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <img [src]="currentUser()?.avatar" [alt]="currentUser()?.name"
                     class="w-full h-full rounded-full object-cover"
                     (error)="onImageError($event)">
                <span *ngIf="!currentUser()?.avatar" class="text-xs font-medium text-gray-600">
                  {{ currentUser()?.name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <span class="text-base font-medium text-white ml-2">{{ currentUser()?.name }}</span>
            </div>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item [routerLink]="'/profile'">
                <mat-icon>person</mat-icon>
                <span>Perfil</span>
              </button>
              <button mat-menu-item [routerLink]="'/settings'">
                <mat-icon>settings</mat-icon>
                <span>Configuración</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>
        <!-- Contenido de la página -->
        <div class="flex-1 overflow-y-scroll min-h-0 p-6 bg-gray-50">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class MainLayoutComponent implements OnInit {
  sidebarOpened = true;
  pageTitle = signal('Panel de Control');
  currentUser = signal(this.authService.getCurrentUser());

  private readonly routeTitleMap: Record<string, string> = {
    '/dashboard': 'Panel de Control',
    '/vehicles': 'Vehículos',
    '/maintenance': 'Mantenimiento',
    '/spare-parts': 'Repuestos',
    '/alerts': 'Alertas',
    '/analytics': 'Analítica',
    '/reports': 'Reportes',
    '/users': 'Gestión de Usuarios',
    '/forms': 'Formularios',
    '/ui': 'Componentes UI',
    '/settings': 'Configuración',
    '/profile': 'Perfil',
    '/blank': 'Página en Blanco'
  };

  constructor(
    private authService: AuthService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {
    effect(() => {
      this.currentUser.set(this.getDisplayUser());
    });
  }

  ngOnInit(): void {
    this.currentUser.set(this.getDisplayUser());
    this.updatePageTitle(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updatePageTitle(event.urlAfterRedirects);
    });
  }

  private getDisplayUser(): AuthUser | null {
    if (environment.useMockData) return this.authService.getCurrentUser();

    const name = this.keycloakService.getFullName();
    const username = this.keycloakService.getUsername();

    if (!name && !username) return null;

    return {
      id: 0,
      name: name || username,
      email: username,
      role: 'keycloak'
    };
  }

  private updatePageTitle(url: string): void {
    const exact = this.routeTitleMap[url];
    if (exact) { this.pageTitle.set(exact); return; }
    const prefix = Object.keys(this.routeTitleMap).find(key => url.startsWith(key + '/'));
    this.pageTitle.set(prefix ? this.routeTitleMap[prefix] : 'Panel de Control');
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.style.display = 'none';
  }

  logout(): void {
    if (environment.useMockData) {
      this.authService.logout();
    } else {
      this.keycloakService.logout();
    }
  }
}
