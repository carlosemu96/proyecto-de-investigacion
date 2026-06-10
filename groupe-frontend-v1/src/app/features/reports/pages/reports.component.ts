import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MaintenanceService } from '../../../core/services/maintenance.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="space-y-6">

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reportes</h1>
        <p class="text-gray-600">Genere y exporte reportes de mantenimiento</p>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Filtros del Reporte</mat-card-title>
        </mat-card-header>
        <mat-card-content class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

            <mat-form-field class="w-full">
              <mat-label>Fecha Desde</mat-label>
              <input matInput type="date" [(ngModel)]="filterFrom" />
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Fecha Hasta</mat-label>
              <input matInput type="date" [(ngModel)]="filterTo" />
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Vehículo</mat-label>
              <mat-select [(ngModel)]="filterVehicle">
                <mat-option value="">Todos los vehículos</mat-option>
                <mat-option *ngFor="let v of vehicles" [value]="v.id">
                  {{ v.brand }} {{ v.model }} ({{ v.plate }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Tipo</mat-label>
              <mat-select [(ngModel)]="filterType">
                <mat-option value="">Todos los tipos</mat-option>
                <mat-option value="PREVENTIVE">Preventivo</mat-option>
                <mat-option value="CORRECTIVE">Correctivo</mat-option>
              </mat-select>
            </mat-form-field>

          </div>

          <div class="flex gap-3 mt-4">
            <button mat-raised-button color="primary" (click)="generateReport()">
              <mat-icon>assessment</mat-icon> Generar Reporte
            </button>
            <button mat-stroked-button (click)="clearFilters()">
              <mat-icon>refresh</mat-icon> Limpiar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="reportData.length > 0">
        <mat-card-header>
          <mat-card-title>Vista Previa del Reporte ({{ reportData.length }} registros)</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-0 relative">
          <app-loading-spinner [loading]="loading" />

          <table mat-table [dataSource]="reportData" class="w-full">

            <ng-container matColumnDef="plate">
              <th mat-header-cell *matHeaderCellDef>Patente</th>
              <td mat-cell *matCellDef="let r">{{ vehiclePlate(r.vehicleId) }}</td>
            </ng-container>

            <ng-container matColumnDef="vehicle">
              <th mat-header-cell *matHeaderCellDef>Vehículo</th>
              <td mat-cell *matCellDef="let r">
                <ng-container *ngIf="vehicleFor(r.vehicleId) as vehicle; else unavailableVehicle">
                  <div class="font-medium">{{ vehicle.brand }} {{ vehicle.model }}</div>
                  <div class="text-xs text-gray-500">{{ vehicle.year }}</div>
                </ng-container>
                <ng-template #unavailableVehicle>No disponible</ng-template>
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let r">{{ r.type === 'PREVENTIVE' ? 'Preventivo' : 'Correctivo' }}</td>
            </ng-container>

            <ng-container matColumnDef="plannedDate">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let r">{{ r.plannedDate }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let r">{{ statusLabel(r.status) }}</td>
            </ng-container>

            <ng-container matColumnDef="totalCost">
              <th mat-header-cell *matHeaderCellDef>Costo</th>
              <td mat-cell *matCellDef="let r">{{ r.totalCost | currency }}</td>
            </ng-container>

            <ng-container matColumnDef="notes">
              <th mat-header-cell *matHeaderCellDef>Notas</th>
              <td mat-cell *matCellDef="let r" class="text-xs text-gray-500">{{ r.notes }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
          </table>
        </mat-card-content>

        <mat-divider></mat-divider>
        <mat-card-content class="p-4">
          <div class="flex gap-8 text-sm">
            <span><strong>Total de registros:</strong> {{ reportData.length }}</span>
            <span><strong>Costo total:</strong> {{ totalCost | currency }}</span>
          </div>
        </mat-card-content>

        <mat-card-actions class="flex gap-2 p-4">
          <button mat-stroked-button (click)="exportCSV()">
            <mat-icon>table_view</mat-icon> Exportar CSV
          </button>
          <button mat-stroked-button (click)="exportPDF()">
            <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
          </button>
        </mat-card-actions>
      </mat-card>

    </div>
  `
})
export class ReportsComponent implements OnInit, OnDestroy {
  allRecords: MaintenanceRecord[] = [];
  reportData: MaintenanceRecord[] = [];
  vehicles: Vehicle[] = [];
  loading = false;

  filterFrom = '';
  filterTo = '';
  filterVehicle = '';
  filterType = '';

  vehiclesById = new Map<string, Vehicle>();

  reportColumns = ['plate', 'vehicle', 'type', 'plannedDate', 'status', 'totalCost', 'notes'];

  private destroy$ = new Subject<void>();

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vehicleService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.vehicles = data;
        this.vehiclesById = new Map(data.map(vehicle => [vehicle.id, vehicle]));
      });

    this.maintenanceService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.allRecords = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateReport(): void {
    this.loading = true;
    this.reportData = this.allRecords.filter(r => {
      const inDateRange =
        (!this.filterFrom || r.plannedDate >= this.filterFrom) &&
        (!this.filterTo   || r.plannedDate <= this.filterTo);
      const matchVehicle = !this.filterVehicle || r.vehicleId === this.filterVehicle;
      const matchType    = !this.filterType    || r.type === this.filterType;
      return inDateRange && matchVehicle && matchType;
    });
    this.loading = false;
  }

  clearFilters(): void {
    this.filterFrom = '';
    this.filterTo = '';
    this.filterVehicle = '';
    this.filterType = '';
    this.reportData = [];
  }

  get totalCost(): number {
    return this.reportData.reduce((sum, r) => sum + r.totalCost, 0);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PLANNED: 'Planificado',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
      OVERDUE: 'Vencido'
    };
    return map[status] ?? status;
  }

  vehicleFor(vehicleId: string): Vehicle | undefined {
    return this.vehiclesById.get(vehicleId);
  }

  vehiclePlate(vehicleId: string): string {
    return this.vehicleFor(vehicleId)?.plate ?? 'No disponible';
  }

  vehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicleFor(vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'No disponible';
  }

  exportCSV(): void {
    if (!this.reportData.length) return;
    const header = 'patente,vehiculo,tipo,fechaPlanificada,estado,costoTotal,notas';
    const rows = this.reportData.map(r => [
      this.vehiclePlate(r.vehicleId),
      this.vehicleLabel(r.vehicleId),
      r.type,
      r.plannedDate,
      r.status,
      r.totalCost,
      r.notes
    ].map(value => this.csvValue(value)).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-mantenimiento-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('CSV exportado', 'Cerrar', { duration: 2000 });
  }

  exportPDF(): void {
    this.snackBar.open('Exportación PDF próximamente — integre jsPDF para producción.', 'Cerrar', { duration: 4000 });
  }

  private csvValue(value: string | number | null | undefined): string {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }
}
