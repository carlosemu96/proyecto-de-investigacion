import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { SparePart } from '../../../core/models/spare-part.model';

@Component({
  selector: 'app-parts-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>{{ isEdit ? 'Editar Repuesto' : 'Agregar Repuesto' }}</h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="grid grid-cols-1 gap-4 mt-2">

          <mat-form-field class="w-full">
            <mat-label>SKU</mat-label>
            <input matInput formControlName="sku" placeholder="FLT-001" />
            <mat-error *ngIf="form.get('sku')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" placeholder="Filtro de Aceite" />
            <mat-error *ngIf="form.get('name')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Categoría</mat-label>
            <input matInput formControlName="category" placeholder="FILTROS" />
            <mat-error *ngIf="form.get('category')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock" />
            <mat-error *ngIf="form.get('stock')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Stock Mínimo</mat-label>
            <input matInput type="number" formControlName="minStock" />
            <mat-error *ngIf="form.get('minStock')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Costo Unitario</mat-label>
            <input matInput type="number" formControlName="unitCost" />
            <mat-error *ngIf="form.get('unitCost')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="flex justify-end gap-2 mt-2">
        <button mat-button (click)="cancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="submit()" [disabled]="form.invalid">
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class PartsFormComponent implements OnInit {
  form!: FormGroup;

  get isEdit(): boolean {
    return !!this.data;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PartsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SparePart | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sku:      [this.data?.sku ?? '',      Validators.required],
      name:     [this.data?.name ?? '',     Validators.required],
      category: [this.data?.category ?? '', Validators.required],
      stock:    [this.data?.stock ?? 0,     Validators.required],
      minStock: [this.data?.minStock ?? 0,  Validators.required],
      unitCost: [this.data?.unitCost ?? 0,  Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      const value = this.isEdit
        ? { ...this.form.value, id: this.data!.id }
        : this.form.value;
      this.dialogRef.close(value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
