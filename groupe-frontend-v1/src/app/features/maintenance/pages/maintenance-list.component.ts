import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MaintenanceService } from '../../../core/services/maintenance.service';
import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog.component';
import { MaintenanceFormComponent } from './maintenance-form.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6">

      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Registros de Mantenimiento</h1>
          <p class="text-gray-600">Gestione y realice seguimiento del mantenimiento planificado y correctivo</p>
        </div>
        <div class="flex gap-2">
          <button mat-stroked-button (click)="toggleOverdue()">
            <mat-icon>warning</mat-icon>
            {{ showOverdue ? 'Mostrar Todos' : 'Solo Vencidos' }}
          </button>
          <button mat-raised-button color="primary" (click)="onAdd()">
            <mat-icon>add</mat-icon> Nuevo Registro
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Filtrar por tipo</mat-label>
              <mat-select [(ngModel)]="filterType" (ngModelChange)="applyFilter()">
                <mat-option value="">Todos los tipos</mat-option>
                <mat-option value="PREVENTIVE">Preventivo</mat-option>
                <mat-option value="CORRECTIVE">Correctivo</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>Filtrar por estado</mat-label>
              <mat-select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
                <mat-option value="">Todos los estados</mat-option>
                <mat-option value="PLANNED">Planificado</mat-option>
                <mat-option value="IN_PROGRESS">En Progreso</mat-option>
                <mat-option value="COMPLETED">Completado</mat-option>
                <mat-option value="OVERDUE">Vencido</mat-option>
              </mat-select>
            </mat-form-field>
            <div class="flex items-center">
              <button mat-stroked-button (click)="clearFilters()">
                <mat-icon>refresh</mat-icon> Limpiar
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content class="p-0 relative">
          <app-loading-spinner [loading]="loading" />
          <app-empty-state
            *ngIf="!loading && filteredRecords.length === 0"
            icon="build"
            message="No se encontraron registros de mantenimiento."
            subMessage="Cree un registro o ajuste los filtros." />

          <table mat-table [dataSource]="filteredRecords" class="w-full" *ngIf="filteredRecords.length">

            <ng-container matColumnDef="vehicleId">
              <th mat-header-cell *matHeaderCellDef>ID Vehículo</th>
              <td mat-cell *matCellDef="let r">{{ r.vehicleId }}</td>
            </ng-container>

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
              <td mat-cell *matCellDef="let r">
                <mat-chip [color]="statusColor(r.status)" selected>{{ statusLabel(r.status) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="totalCost">
              <th mat-header-cell *matHeaderCellDef>Costo</th>
              <td mat-cell *matCellDef="let r">{{ r.totalCost | currency }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let r">
                <button mat-icon-button [matMenuTriggerFor]="rowMenu" (click)="activeRecord = r">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <mat-menu #rowMenu="matMenu">
            <button mat-menu-item (click)="onEdit(activeRecord!)">
              <mat-icon>edit</mat-icon><span>Editar</span>
            </button>
            <button mat-menu-item (click)="onDelete(activeRecord!)">
              <mat-icon>delete</mat-icon><span>Eliminar</span>
            </button>
          </mat-menu>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class MaintenanceListComponent implements OnInit, OnDestroy {
  records: MaintenanceRecord[] = [];
  filteredRecords: MaintenanceRecord[] = [];

  loading = false;
  showOverdue = false;
  filterType = '';
  filterStatus = '';
  activeRecord: MaintenanceRecord | null = null;

  columns = ['vehicleId', 'type', 'plannedDate', 'status', 'totalCost', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private maintenanceService: MaintenanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecords(): void {
    this.loading = true;
    this.maintenanceService.getAll(this.showOverdue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.records = data;
          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al cargar los registros', 'Cerrar', { duration: 3000 });
        }
      });
  }

  toggleOverdue(): void {
    this.showOverdue = !this.showOverdue;
    this.loadRecords();
  }

  applyFilter(): void {
    this.filteredRecords = this.records.filter(r => {
      const matchType = !this.filterType || r.type === this.filterType;
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      return matchType && matchStatus;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  onAdd(): void {
    const ref = this.dialog.open(MaintenanceFormComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((record: Omit<MaintenanceRecord, 'id' | 'createdAt'> | null) => {
      if (record) {
        this.maintenanceService.create(record)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Registro creado', 'Cerrar', { duration: 2000 });
            this.loadRecords();
          });
      }
    });
  }

  onEdit(record: MaintenanceRecord): void {
    const ref = this.dialog.open(MaintenanceFormComponent, { width: '560px', data: record });
    ref.afterClosed().subscribe((updated: MaintenanceRecord | null) => {
      if (updated) {
        this.maintenanceService.update(record.id, updated)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Registro actualizado', 'Cerrar', { duration: 2000 });
            this.loadRecords();
          });
      }
    });
  }

  onDelete(record: MaintenanceRecord): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Registro',
        message: `¿Eliminar el registro de mantenimiento #${record.id}?`,
        confirmLabel: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.maintenanceService.delete(record.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Registro eliminado', 'Cerrar', { duration: 2000 });
            this.loadRecords();
          });
      }
    });
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

  statusColor(status: string): 'primary' | 'accent' | 'warn' {
    const map: Record<string, 'primary' | 'accent' | 'warn'> = {
      PLANNED: 'primary',
      IN_PROGRESS: 'accent',
      COMPLETED: 'primary',
      OVERDUE: 'warn'
    };
    return map[status] ?? 'primary';
  }
}
