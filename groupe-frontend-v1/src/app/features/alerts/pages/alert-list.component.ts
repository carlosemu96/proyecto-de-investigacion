import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AlertService } from '../../../core/services/alert.service';
import { Alert } from '../../../core/models/alert.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog.component';

const POLL_INTERVAL_MS = 30_000;

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
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
          <h1 class="text-2xl font-bold text-gray-900">Alertas</h1>
          <p class="text-gray-600">Alertas de mantenimiento en tiempo real — actualiza cada 30 s</p>
        </div>
      </div>

      <mat-card>
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="OPEN">Abierto</mat-option>
                <mat-option value="RESOLVED">Resuelto</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>Severidad</mat-label>
              <mat-select [(ngModel)]="filterSeverity" (ngModelChange)="applyFilter()">
                <mat-option value="">Todas</mat-option>
                <mat-option value="CRITICAL">Crítica</mat-option>
                <mat-option value="HIGH">Alta</mat-option>
                <mat-option value="MEDIUM">Media</mat-option>
                <mat-option value="LOW">Baja</mat-option>
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
            *ngIf="!loading && filteredAlerts.length === 0"
            icon="notifications_off"
            message="No hay alertas que coincidan con los filtros."
            subMessage="Pruebe cambiando el estado o la severidad." />

          <table mat-table [dataSource]="filteredAlerts" class="w-full" *ngIf="filteredAlerts.length">

            <ng-container matColumnDef="severity">
              <th mat-header-cell *matHeaderCellDef>Severidad</th>
              <td mat-cell *matCellDef="let a">
                <mat-chip [color]="severityColor(a.severity)" selected>{{ severityLabel(a.severity) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let a">
                <div class="font-medium">{{ a.title }}</div>
                <div class="text-xs text-gray-500">{{ a.message }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let a">
                <mat-chip [color]="a.status === 'OPEN' ? 'warn' : 'primary'" selected>
                  {{ a.status === 'OPEN' ? 'Abierto' : 'Resuelto' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Creado</th>
              <td mat-cell *matCellDef="let a" class="text-sm text-gray-500">
                {{ a.createdAt | date:'short' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let a">
                <button mat-icon-button [matMenuTriggerFor]="rowMenu" (click)="activeAlert = a">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"
                [ngClass]="row.severity === 'CRITICAL' ? 'bg-red-50' : ''">
            </tr>
          </table>

          <mat-menu #rowMenu="matMenu">
            <button mat-menu-item (click)="onResolve(activeAlert!)" [disabled]="activeAlert?.status === 'RESOLVED'">
              <mat-icon>check_circle</mat-icon><span>Resolver</span>
            </button>
            <button mat-menu-item (click)="onDelete(activeAlert!)">
              <mat-icon>delete</mat-icon><span>Eliminar</span>
            </button>
          </mat-menu>

        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  loading = false;
  filterStatus = '';
  filterSeverity = '';
  activeAlert: Alert | null = null;

  columns = ['severity', 'title', 'status', 'createdAt', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    interval(POLL_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() => {
        this.loading = true;
        return this.alertService.getAll();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        this.alerts = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al cargar las alertas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(): void {
    this.filteredAlerts = this.alerts.filter(a => {
      const matchStatus = !this.filterStatus || a.status === this.filterStatus;
      const matchSeverity = !this.filterSeverity || a.severity === this.filterSeverity;
      return matchStatus && matchSeverity;
    });
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterSeverity = '';
    this.applyFilter();
  }

  onResolve(alert: Alert): void {
    this.alertService.updateStatus(alert.id, 'RESOLVED')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Alerta resuelta', 'Cerrar', { duration: 2000 });
        const idx = this.alerts.findIndex(a => a.id === alert.id);
        if (idx !== -1) {
          this.alerts[idx] = { ...this.alerts[idx], status: 'RESOLVED', resolvedAt: new Date().toISOString() };
          this.applyFilter();
        }
      });
  }

  onDelete(alert: Alert): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Alerta',
        message: `¿Eliminar la alerta "${alert.title}"?`,
        confirmLabel: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.alertService.delete(alert.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Alerta eliminada', 'Cerrar', { duration: 2000 });
            this.alerts = this.alerts.filter(a => a.id !== alert.id);
            this.applyFilter();
          });
      }
    });
  }

  severityLabel(severity: string): string {
    const map: Record<string, string> = {
      CRITICAL: 'Crítica',
      HIGH: 'Alta',
      MEDIUM: 'Media',
      LOW: 'Baja'
    };
    return map[severity] ?? severity;
  }

  severityColor(severity: string): 'primary' | 'accent' | 'warn' {
    const map: Record<string, 'primary' | 'accent' | 'warn'> = {
      CRITICAL: 'warn',
      HIGH: 'warn',
      MEDIUM: 'accent',
      LOW: 'primary'
    };
    return map[severity] ?? 'primary';
  }
}
