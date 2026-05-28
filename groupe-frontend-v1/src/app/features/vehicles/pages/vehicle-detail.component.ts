import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

import { VehicleService } from '../../../core/services/vehicle.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="space-y-6">

      <div>
        <button mat-stroked-button routerLink="/vehicles">
          <mat-icon>arrow_back</mat-icon> Volver a Vehículos
        </button>
      </div>

      <mat-card *ngIf="vehicle; else loadingCard">
        <mat-card-header>
          <mat-icon mat-card-avatar class="text-blue-500">directions_car</mat-icon>
          <mat-card-title>{{ vehicle.brand }} {{ vehicle.model }}</mat-card-title>
          <mat-card-subtitle>Patente: {{ vehicle.plate }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="mt-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p class="text-xs text-gray-500">Año</p>
              <p class="font-semibold">{{ vehicle.year }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Kilometraje</p>
              <p class="font-semibold">{{ vehicle.currentMileage | number }} km</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Estado</p>
              <mat-chip [color]="statusColor(vehicle.status)" selected>{{ statusLabel(vehicle.status) }}</mat-chip>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      <ng-template #loadingCard>
        <mat-card class="relative h-32">
          <app-loading-spinner [loading]="loading" />
        </mat-card>
      </ng-template>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Historial de Mantenimiento</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-0">
          <table mat-table [dataSource]="maintenanceHistory" class="w-full">

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let r">
                <mat-chip [color]="r.type === 'PREVENTIVE' ? 'primary' : 'warn'" selected>
                  {{ r.type === 'PREVENTIVE' ? 'Preventivo' : 'Correctivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="plannedDate">
              <th mat-header-cell *matHeaderCellDef>Fecha Planificada</th>
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
              <td mat-cell *matCellDef="let r" class="text-sm text-gray-500">{{ r.notes }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class VehicleDetailComponent implements OnInit, OnDestroy {
  vehicle: Vehicle | null = null;
  maintenanceHistory: MaintenanceRecord[] = [];
  loading = false;
  historyColumns = ['type', 'plannedDate', 'status', 'totalCost', 'notes'];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap(params => this.vehicleService.getById(params.get('id') ?? '')),
      takeUntil(this.destroy$)
    ).subscribe(v => {
      this.vehicle = v;
      this.loadHistory(v.id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHistory(vehicleId: string): void {
    this.maintenanceService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(records => {
        this.maintenanceHistory = records.filter(r => r.vehicleId === vehicleId);
        this.loading = false;
      });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'Activo',
      MAINTENANCE: 'En Mantenimiento',
      INACTIVE: 'Inactivo',
      PLANNED: 'Planificado',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
      OVERDUE: 'Vencido'
    };
    return map[status] ?? status;
  }

  statusColor(status: string): 'primary' | 'accent' | 'warn' {
    const map: Record<string, 'primary' | 'accent' | 'warn'> = {
      ACTIVE: 'primary',
      MAINTENANCE: 'accent',
      INACTIVE: 'warn'
    };
    return map[status] ?? 'primary';
  }
}
