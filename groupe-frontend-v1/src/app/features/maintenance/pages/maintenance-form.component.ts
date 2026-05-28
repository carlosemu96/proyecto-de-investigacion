import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>{{ isEdit ? 'Editar Registro de Mantenimiento' : 'Nuevo Registro de Mantenimiento' }}</h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="grid grid-cols-1 gap-4 mt-2">

          <mat-form-field class="w-full">
            <mat-label>ID Vehículo</mat-label>
            <input matInput formControlName="vehicleId" placeholder="ej. 1" />
            <mat-error *ngIf="form.get('vehicleId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="type">
              <mat-option value="PREVENTIVE">Preventivo</mat-option>
              <mat-option value="CORRECTIVE">Correctivo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Fecha Planificada</mat-label>
            <input matInput type="date" formControlName="plannedDate" />
            <mat-error *ngIf="form.get('plannedDate')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Kilometraje al Servicio (km)</mat-label>
            <input matInput type="number" formControlName="mileageAtService" />
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Costo Total</mat-label>
            <input matInput type="number" formControlName="totalCost" />
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option value="PLANNED">Planificado</mat-option>
              <mat-option value="IN_PROGRESS">En Progreso</mat-option>
              <mat-option value="COMPLETED">Completado</mat-option>
              <mat-option value="OVERDUE">Vencido</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Notas</mat-label>
            <textarea matInput formControlName="notes" rows="3"></textarea>
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
export class MaintenanceFormComponent implements OnInit {
  form!: FormGroup;

  get isEdit(): boolean {
    return !!this.data;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MaintenanceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MaintenanceRecord | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vehicleId:        [this.data?.vehicleId ?? '',         Validators.required],
      type:             [this.data?.type ?? 'PREVENTIVE'],
      plannedDate:      [this.data?.plannedDate ?? '',       Validators.required],
      completedDate:    [this.data?.completedDate ?? ''],
      mileageAtService: [this.data?.mileageAtService ?? 0],
      totalCost:        [this.data?.totalCost ?? 0],
      sparePartIds:     [this.data?.sparePartIds ?? []],
      status:           [this.data?.status ?? 'PLANNED'],
      notes:            [this.data?.notes ?? '']
    });
  }

  submit(): void {
    if (this.form.valid) {
      const value = this.isEdit
        ? { ...this.form.value, id: this.data!.id, createdAt: this.data!.createdAt }
        : this.form.value;
      this.dialogRef.close(value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
