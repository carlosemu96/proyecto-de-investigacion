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
import { MatTooltipModule } from '@angular/material/tooltip';

import { SparePartService } from '../../../core/services/spare-part.service';
import { SparePart } from '../../../core/models/spare-part.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog.component';
import { PartsFormComponent } from './parts-form.component';
import { StockMovementComponent } from './stock-movement.component';

@Component({
  selector: 'app-parts-list',
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
    MatTooltipModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6">

      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario de Repuestos</h1>
          <p class="text-gray-600">Controle los niveles de stock y gestione los repuestos</p>
        </div>
        <button mat-raised-button color="primary" (click)="onAdd()">
          <mat-icon>add</mat-icon> Agregar Repuesto
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Buscar repuestos</mat-label>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Nombre, SKU, categoría…" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Categoría</mat-label>
              <mat-select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange()">
                <mat-option value="">Todas las categorías</mat-option>
                <mat-option *ngFor="let category of categories" [value]="category">{{ category }}</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="flex items-center gap-2">
              <button
                mat-stroked-button
                type="button"
                (click)="clearFilters()"
                [disabled]="!searchTerm && !selectedCategory">
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
            *ngIf="!loading && filteredParts.length === 0"
            icon="inventory_2"
            message="No se encontraron repuestos."
            subMessage="Agregue un repuesto o ajuste la búsqueda." />

          <table mat-table [dataSource]="filteredParts" class="w-full" *ngIf="filteredParts.length">

            <ng-container matColumnDef="sku">
              <th mat-header-cell *matHeaderCellDef>SKU</th>
              <td mat-cell *matCellDef="let p" class="font-mono text-sm">{{ p.sku }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let p">
                <div class="font-medium">{{ p.name }}</div>
                <div class="text-xs text-gray-500">{{ p.category }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let p">
                <span
                  [ngClass]="p.stock < p.minStock ? 'text-red-600 font-bold' : 'text-gray-900'"
                  [matTooltip]="p.stock < p.minStock ? 'Por debajo del stock mínimo (' + p.minStock + ')' : ''">
                  {{ p.stock }}
                </span>
                <mat-chip *ngIf="p.stock < p.minStock" color="warn" selected class="ml-2 text-xs">Bajo</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="minStock">
              <th mat-header-cell *matHeaderCellDef>Stock Mín.</th>
              <td mat-cell *matCellDef="let p">{{ p.minStock }}</td>
            </ng-container>

            <ng-container matColumnDef="unitCost">
              <th mat-header-cell *matHeaderCellDef>Costo Unitario</th>
              <td mat-cell *matCellDef="let p">{{ p.unitCost | currency }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button [matMenuTriggerFor]="rowMenu" (click)="activePart = p">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"
                [ngClass]="row.stock < row.minStock ? 'bg-red-50' : ''">
            </tr>
          </table>

          <mat-menu #rowMenu="matMenu">
            <button mat-menu-item (click)="onAdjustStock(activePart!)">
              <mat-icon>swap_vert</mat-icon><span>Ajustar Stock</span>
            </button>
            <button mat-menu-item (click)="onEdit(activePart!)">
              <mat-icon>edit</mat-icon><span>Editar</span>
            </button>
            <button mat-menu-item (click)="onDelete(activePart!)">
              <mat-icon>delete</mat-icon><span>Eliminar</span>
            </button>
          </mat-menu>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class PartsListComponent implements OnInit, OnDestroy {
  parts: SparePart[] = [];
  filteredParts: SparePart[] = [];
  categories: string[] = [];
  selectedCategory = '';
  loading = false;
  searchTerm = '';
  activePart: SparePart | null = null;
  columns = ['sku', 'name', 'stock', 'minStock', 'unitCost', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private sparePartService: SparePartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadParts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadParts(): void {
    this.loading = true;
    const categories = this.selectedCategory ? [this.selectedCategory] : [];
    this.sparePartService.getAll(categories)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.parts = data;
          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al cargar los repuestos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  loadCategories(): void {
    this.sparePartService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: categories => this.categories = categories,
        error: () => this.snackBar.open('Error al cargar las categorías', 'Cerrar', { duration: 3000 })
      });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredParts = this.parts.filter(p =>
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  onCategoryChange(): void {
    this.loadParts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.loadParts();
  }

  onAdd(): void {
    const ref = this.dialog.open(PartsFormComponent, { width: '480px', data: null });
    ref.afterClosed().subscribe((part: Omit<SparePart, 'id'> | null) => {
      if (part) {
        this.sparePartService.create(part)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Repuesto agregado', 'Cerrar', { duration: 2000 });
            this.loadParts();
          });
      }
    });
  }

  onEdit(part: SparePart): void {
    const ref = this.dialog.open(PartsFormComponent, { width: '480px', data: part });
    ref.afterClosed().subscribe((updated: SparePart | null) => {
      if (updated) {
        this.sparePartService.update(part.id, updated)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Repuesto actualizado', 'Cerrar', { duration: 2000 });
            this.loadParts();
          });
      }
    });
  }

  onAdjustStock(part: SparePart): void {
    const ref = this.dialog.open(StockMovementComponent, { width: '360px', data: part });
    ref.afterClosed().subscribe((delta: number | null) => {
      if (delta !== null && delta !== undefined) {
        this.sparePartService.adjustStock(part.id, delta)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Stock actualizado', 'Cerrar', { duration: 2000 });
            this.loadParts();
          });
      }
    });
  }

  onDelete(part: SparePart): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Repuesto',
        message: `¿Eliminar "${part.name}" (${part.sku})?`,
        confirmLabel: 'Eliminar'
      }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sparePartService.delete(part.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Repuesto eliminado', 'Cerrar', { duration: 2000 });
            this.loadParts();
          });
      }
    });
  }
}
