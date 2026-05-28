import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart, registerables } from 'chart.js';

import { DashboardService } from '../../../core/services/dashboard.service';
import { AlertService } from '../../../core/services/alert.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { DashboardSummary } from '../../../core/models/dashboard-summary.model';
import { Alert } from '../../../core/models/alert.model';
import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="space-y-6">

      <!-- Tarjetas KPI -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <mat-card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <mat-card-content class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold opacity-80">Total de Vehículos</h3>
                <p class="text-3xl font-bold">{{ summary?.totalVehicles ?? '—' }}</p>
                <a routerLink="/vehicles" class="text-xs opacity-80 underline hover:opacity-100">Ver todos</a>
              </div>
              <mat-icon class="text-4xl opacity-60" style="font-size:40px">directions_car</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <mat-card-content class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold opacity-80">Mantenimientos Pendientes</h3>
                <p class="text-3xl font-bold">{{ summary?.plannedMaintenances ?? '—' }}</p>
                <a routerLink="/maintenance" class="text-xs opacity-80 underline hover:opacity-100">Ver agenda</a>
              </div>
              <mat-icon class="text-4xl opacity-60" style="font-size:40px">build</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <mat-card-content class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold opacity-80">Repuestos con Stock Bajo</h3>
                <p class="text-3xl font-bold">{{ summary?.lowStockParts ?? '—' }}</p>
                <a routerLink="/spare-parts" class="text-xs opacity-80 underline hover:opacity-100">Ver inventario</a>
              </div>
              <mat-icon class="text-4xl opacity-60" style="font-size:40px">inventory_2</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <mat-card-content class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold opacity-80">Alertas Abiertas</h3>
                <p class="text-3xl font-bold">{{ openAlerts.length }}</p>
                <a routerLink="/alerts" class="text-xs opacity-80 underline hover:opacity-100">Ver alertas</a>
              </div>
              <mat-icon class="text-4xl opacity-60" style="font-size:40px">notifications_active</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

      </div>

      <!-- Fila de gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Tendencia de Mantenimientos</mat-card-title>
            <mat-card-subtitle>Eventos mensuales (últimos 6 meses)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas #maintenanceChart width="400" height="200"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Distribución por Estado</mat-card-title>
            <mat-card-subtitle>Registros de mantenimiento por estado</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas #statusChart width="400" height="200"></canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Fila inferior: Alertas + Próximos servicios + Riesgo predictivo -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center gap-2">
              <mat-icon class="text-red-500">notifications_active</mat-icon>
              Alertas Abiertas Recientes
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list *ngIf="openAlerts.length; else noAlerts">
              <ng-container *ngFor="let alert of openAlerts; let last = last">
                <mat-list-item>
                  <mat-icon matListItemIcon [ngClass]="severityClass(alert.severity)">
                    {{ severityIcon(alert.severity) }}
                  </mat-icon>
                  <div matListItemTitle class="font-medium text-sm">{{ alert.title }}</div>
                  <div matListItemLine class="text-xs text-gray-500">{{ alert.message }}</div>
                </mat-list-item>
                <mat-divider *ngIf="!last"></mat-divider>
              </ng-container>
            </mat-list>
            <ng-template #noAlerts>
              <p class="text-gray-400 text-sm p-4">Sin alertas abiertas — ¡todo en orden!</p>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center gap-2">
              <mat-icon class="text-blue-500">event</mat-icon>
              Próximos Servicios
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list *ngIf="upcomingRecords.length; else noUpcoming">
              <ng-container *ngFor="let rec of upcomingRecords; let last = last">
                <mat-list-item>
                  <mat-icon matListItemIcon class="text-orange-500">build</mat-icon>
                  <div matListItemTitle class="text-sm font-medium">Vehículo #{{ rec.vehicleId }}</div>
                  <div matListItemLine class="text-xs text-gray-500">{{ rec.plannedDate }} · {{ rec.type }}</div>
                </mat-list-item>
                <mat-divider *ngIf="!last"></mat-divider>
              </ng-container>
            </mat-list>
            <ng-template #noUpcoming>
              <p class="text-gray-400 text-sm p-4">Sin mantenimientos próximos programados.</p>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center gap-2">
              <mat-icon class="text-purple-500">psychology</mat-icon>
              Riesgo Predictivo (IA)
            </mat-card-title>
            <mat-card-subtitle>Puntuaciones de riesgo de falla (simuladas)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="space-y-3 mt-2">
            <div *ngFor="let item of riskScores">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ item.label }}</span>
                <span [ngClass]="item.risk > 70 ? 'text-red-500' : item.risk > 40 ? 'text-orange-500' : 'text-green-600'">
                  {{ item.risk }}%
                </span>
              </div>
              <mat-progress-bar
                mode="determinate"
                [value]="item.risk"
                [color]="item.risk > 70 ? 'warn' : item.risk > 40 ? 'accent' : 'primary'">
              </mat-progress-bar>
            </div>
            <p class="text-xs text-gray-400 mt-2">* Las puntuaciones de riesgo son valores ilustrativos.</p>
          </mat-card-content>
        </mat-card>

      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('maintenanceChart', { static: false }) maintenanceChartRef!: ElementRef;
  @ViewChild('statusChart', { static: false }) statusChartRef!: ElementRef;

  summary: DashboardSummary | null = null;
  openAlerts: Alert[] = [];
  upcomingRecords: MaintenanceRecord[] = [];

  riskScores = [
    { label: 'Toyota Corolla (ABC-1234)', risk: 25 },
    { label: 'Honda Civic (XYZ-5678)', risk: 72 },
    { label: 'Ford Transit (DEF-9101)', risk: 55 },
    { label: 'Chevy Silverado (GHI-1123)', risk: 88 }
  ];

  private maintenanceChart: Chart | null = null;
  private statusChart: Chart | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private maintenanceService: MaintenanceService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadOpenAlerts();
    this.loadUpcomingRecords();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.maintenanceChart?.destroy();
    this.statusChart?.destroy();
  }

  private loadSummary(): void {
    this.dashboardService.getSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.summary = data);
  }

  private loadOpenAlerts(): void {
    this.alertService.getAll(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.openAlerts = data.slice(0, 5));
  }

  private loadUpcomingRecords(): void {
    this.maintenanceService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.upcomingRecords = data.filter(r => r.status === 'PLANNED').slice(0, 5);
      });
  }

  private initCharts(): void {
    this.initMaintenanceTrendChart();
    this.initStatusChart();
  }

  private initMaintenanceTrendChart(): void {
    const ctx = this.maintenanceChartRef.nativeElement.getContext('2d');
    this.maintenanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [
          {
            label: 'Preventivo',
            data: [3, 5, 4, 6, 3, 7],
            borderColor: 'rgb(59,130,246)',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.4
          },
          {
            label: 'Correctivo',
            data: [1, 2, 3, 1, 4, 2],
            borderColor: 'rgb(239,68,68)',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private initStatusChart(): void {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Planificado', 'En Progreso', 'Completado', 'Vencido'],
        datasets: [{
          data: [
            this.summary?.plannedMaintenances ?? 1,
            this.summary?.inProgressMaintenances ?? 0,
            this.summary?.completedMaintenances ?? 1,
            1
          ],
          backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
      }
    });
  }

  severityClass(severity: string): string {
    const map: Record<string, string> = {
      HIGH: 'text-red-500',
      CRITICAL: 'text-red-700',
      MEDIUM: 'text-orange-500',
      LOW: 'text-green-500'
    };
    return map[severity] ?? 'text-gray-500';
  }

  severityIcon(severity: string): string {
    const map: Record<string, string> = {
      HIGH: 'error',
      CRITICAL: 'dangerous',
      MEDIUM: 'warning',
      LOW: 'info'
    };
    return map[severity] ?? 'circle';
  }
}
