import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>{{ isEdit ? 'Editar Vehículo' : 'Agregar Vehículo' }}</h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="grid grid-cols-1 gap-4 mt-2">

          <mat-form-field class="w-full">
            <mat-label>Patente</mat-label>
            <input matInput formControlName="plate" placeholder="ABC-1234" />
            <mat-error *ngIf="form.get('plate')?.hasError('required')">La patente es obligatoria</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Marca</mat-label>
            <input matInput formControlName="brand" placeholder="Toyota" />
            <mat-error *ngIf="form.get('brand')?.hasError('required')">La marca es obligatoria</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Modelo</mat-label>
            <input matInput formControlName="model" placeholder="Corolla" />
            <mat-error *ngIf="form.get('model')?.hasError('required')">El modelo es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="year" placeholder="2020" />
            <mat-error *ngIf="form.get('year')?.hasError('required')">El año es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Kilometraje Actual (km)</mat-label>
            <input matInput type="number" formControlName="currentMileage" />
            <mat-error *ngIf="form.get('currentMileage')?.hasError('required')">El kilometraje es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option value="ACTIVE">Activo</mat-option>
              <mat-option value="MAINTENANCE">En Mantenimiento</mat-option>
              <mat-option value="INACTIVE">Inactivo</mat-option>
            </mat-select>
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
export class VehicleFormComponent implements OnInit {
  form!: FormGroup;

  get isEdit(): boolean {
    return !!this.data;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      plate:          [this.data?.plate ?? '',          Validators.required],
      brand:          [this.data?.brand ?? '',          Validators.required],
      model:          [this.data?.model ?? '',          Validators.required],
      year:           [this.data?.year ?? new Date().getFullYear(), Validators.required],
      currentMileage: [this.data?.currentMileage ?? 0, Validators.required],
      status:         [this.data?.status ?? 'ACTIVE']
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
