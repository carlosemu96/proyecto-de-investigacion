import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { Chart, registerables } from 'chart.js';

import { SparePartService } from '../../../core/services/spare-part.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule
  ],
  template: `
    <div class="space-y-6">

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analítica</h1>
        <p class="text-gray-600">Análisis predictivo y tendencias de costos de mantenimiento</p>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="text-purple-500">psychology</mat-icon>
          <mat-card-title>Predicciones de Riesgo de Falla (IA)</mat-card-title>
          <mat-card-subtitle>Predicciones simuladas — conectar con endpoint de modelo real</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-3 mt-2">
          <div *ngFor="let item of riskPredictions">
            <div class="flex justify-between text-sm mb-1">
              <div>
                <span class="font-medium">{{ item.vehicle }}</span>
                <span class="text-xs text-gray-500 ml-2">{{ item.reason }}</span>
              </div>
              <span [ngClass]="item.risk > 70 ? 'text-red-600 font-bold' : item.risk > 40 ? 'text-orange-500' : 'text-green-600'">
                {{ item.risk }}%
              </span>
            </div>
            <mat-progress-bar
              mode="determinate"
              [value]="item.risk"
              [color]="item.risk > 70 ? 'warn' : item.risk > 40 ? 'accent' : 'primary'">
            </mat-progress-bar>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <mat-card>
          <mat-card-header>
            <mat-card-title>Costo Mensual de Mantenimiento</mat-card-title>
            <mat-card-subtitle>Últimos 6 meses en ARS</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas #costChart width="400" height="220"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Distribución por Tipo de Falla</mat-card-title>
            <mat-card-subtitle>Eventos preventivos vs correctivos</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas #typeChart width="400" height="220"></canvas>
          </mat-card-content>
        </mat-card>

      </div>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="text-blue-500">lightbulb</mat-icon>
          <mat-card-title>Acciones Recomendadas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let rec of recommendations">
              <mat-icon matListItemIcon [ngClass]="rec.urgent ? 'text-red-500' : 'text-blue-500'">
                {{ rec.urgent ? 'priority_high' : 'task_alt' }}
              </mat-icon>
              <div matListItemTitle>{{ rec.action }}</div>
              <div matListItemLine class="text-xs text-gray-500">{{ rec.reason }}</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>

    </div>
  `
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('costChart', { static: false }) costChartRef!: ElementRef;
  @ViewChild('typeChart', { static: false }) typeChartRef!: ElementRef;

  private costChart: Chart | null = null;
  private typeChart: Chart | null = null;
  private destroy$ = new Subject<void>();

  riskPredictions = [
    { vehicle: 'Toyota Corolla (ABC-1234)', risk: 25, reason: 'Mantenimiento al día' },
    { vehicle: 'Honda Civic (XYZ-5678)',   risk: 72, reason: 'Desgaste detectado en frenos' },
    { vehicle: 'Ford Transit (DEF-9101)',  risk: 55, reason: 'Inspección vencida' },
    { vehicle: 'Chevy Silverado (GHI-1123)', risk: 88, reason: 'Alto kilometraje, varios pendientes' }
  ];

  recommendations = [
    { action: 'Programar inspección inmediata de frenos para Honda Civic', reason: 'Riesgo de falla 72% — patrón de desgaste detectado', urgent: true },
    { action: 'Reponer Pastillas de Freno (BRK-001)', reason: 'Stock por debajo del mínimo', urgent: true },
    { action: 'Completar inspección vencida para Ford Transit', reason: 'Fecha de inspección planificada superada', urgent: false },
    { action: 'Cambio de aceite preventivo para Silverado', reason: 'Próximo al intervalo de servicio de 90k km', urgent: false }
  ];

  constructor(
    private sparePartService: SparePartService,
    private maintenanceService: MaintenanceService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.sparePartService.getLowStock().pipe(takeUntil(this.destroy$)).subscribe();
    this.maintenanceService.getAll().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngAfterViewInit(): void {
    this.initCostChart();
    this.initTypeChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.costChart?.destroy();
    this.typeChart?.destroy();
  }

  private initCostChart(): void {
    const ctx = this.costChartRef.nativeElement.getContext('2d');
    this.costChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Costo (ARS)',
          data: [12000, 8500, 15000, 9000, 22000, 13500],
          backgroundColor: 'rgba(99,102,241,0.8)',
          borderColor: 'rgb(99,102,241)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private initTypeChart(): void {
    const ctx = this.typeChartRef.nativeElement.getContext('2d');
    this.typeChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Preventivo', 'Correctivo'],
        datasets: [{
          data: [14, 6],
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
