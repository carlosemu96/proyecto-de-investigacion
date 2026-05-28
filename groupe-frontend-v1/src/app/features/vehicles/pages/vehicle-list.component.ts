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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog.component';
import { VehicleFormComponent } from './vehicle-form.component';

@Component({
  selector: 'app-vehicle-list',
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
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6">

      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vehículos</h1>
          <p class="text-gray-600">Gestione la flota y los registros de vehículos</p>
        </div>
        <button mat-raised-button color="primary" (click)="onAdd()">
          <mat-icon>add</mat-icon>
          Agregar Vehículo
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Buscar</mat-label>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Patente, marca, modelo…" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilter()">
                <mat-option value="">Todos los estados</mat-option>
                <mat-option value="ACTIVE">Activo</mat-option>
                <mat-option value="MAINTENANCE">En Mantenimiento</mat-option>
                <mat-option value="INACTIVE">Inactivo</mat-option>
              </mat-select>
            </mat-form-field>
            <div class="flex items-center gap-2">
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
            *ngIf="!loading && filteredVehicles.length === 0"
            icon="directions_car"
            message="No se encontraron vehículos."
            subMessage="Agregue un vehículo o ajuste los filtros." />

          <table mat-table [dataSource]="pagedVehicles" class="w-full" *ngIf="filteredVehicles.length">

            <ng-container matColumnDef="plate">
              <th mat-header-cell *matHeaderCellDef>Patente</th>
              <td mat-cell *matCellDef="let v" class="font-mono font-semibold">{{ v.plate }}</td>
            </ng-container>

            <ng-container matColumnDef="vehicle">
              <th mat-header-cell *matHeaderCellDef>Vehículo</th>
              <td mat-cell *matCellDef="let v">
                <div class="font-medium">{{ v.brand }} {{ v.model }}</div>
                <div class="text-xs text-gray-500">{{ v.year }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="mileage">
              <th mat-header-cell *matHeaderCellDef>Kilometraje</th>
              <td mat-cell *matCellDef="let v">{{ v.currentMileage | number }} km</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let v">
                <mat-chip [color]="statusColor(v.status)" selected>{{ statusLabel(v.status) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let v">
                <button mat-icon-button [matMenuTriggerFor]="rowMenu" (click)="activeVehicle = v">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <mat-menu #rowMenu="matMenu">
            <button mat-menu-item (click)="onEdit(activeVehicle!)">
              <mat-icon>edit</mat-icon><span>Editar</span>
            </button>
            <button mat-menu-item (click)="onDelete(activeVehicle!)">
              <mat-icon>delete</mat-icon><span>Eliminar</span>
            </button>
          </mat-menu>

          <mat-paginator
            [length]="filteredVehicles.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 20]"
            (page)="onPage($event)">
          </mat-paginator>

        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class VehicleListComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  pagedVehicles: Vehicle[] = [];

  loading = false;
  searchTerm = '';
  selectedStatus = '';
  activeVehicle: Vehicle | null = null;

  columns = ['plate', 'vehicle', 'mileage', 'status', 'actions'];
  pageSize = 10;
  pageIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.vehicles = data;
          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al cargar los vehículos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVehicles = this.vehicles.filter(v => {
      const matchesSearch = !term ||
        v.plate.toLowerCase().includes(term) ||
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term);
      const matchesStatus = !this.selectedStatus || v.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
    this.pageIndex = 0;
    this.updatePage();
  }

  updatePage(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedVehicles = this.filteredVehicles.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePage();
  }

  onAdd(): void {
    const ref = this.dialog.open(VehicleFormComponent, { width: '480px', data: null });
    ref.afterClosed().subscribe((vehicle: Omit<Vehicle, 'id'> | null) => {
      if (vehicle) {
        this.vehicleService.create(vehicle)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Vehículo agregado', 'Cerrar', { duration: 2000 });
            this.loadVehicles();
          });
      }
    });
  }

  onEdit(vehicle: Vehicle): void {
    const ref = this.dialog.open(VehicleFormComponent, { width: '480px', data: vehicle });
    ref.afterClosed().subscribe((updated: Vehicle | null) => {
      if (updated) {
        this.vehicleService.update(vehicle.id, updated)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Vehículo actualizado', 'Cerrar', { duration: 2000 });
            this.loadVehicles();
          });
      }
    });
  }

  onDelete(vehicle: Vehicle): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Vehículo',
        message: `¿Eliminar ${vehicle.brand} ${vehicle.model} (${vehicle.plate})?`,
        confirmLabel: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.vehicleService.delete(vehicle.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Vehículo eliminado', 'Cerrar', { duration: 2000 });
            this.loadVehicles();
          });
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.applyFilter();
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'Activo',
      MAINTENANCE: 'En Mantenimiento',
      INACTIVE: 'Inactivo'
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
