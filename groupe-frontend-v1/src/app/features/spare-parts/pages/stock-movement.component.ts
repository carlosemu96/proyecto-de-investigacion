import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SparePart } from '../../../core/models/spare-part.model';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>Ajustar Stock — {{ data.name }}</h2>

      <mat-dialog-content>
        <p class="text-sm text-gray-500 mb-4">
          Stock actual: <strong>{{ data.stock }}</strong> unidades
        </p>

        <form [formGroup]="form" class="flex flex-col gap-4">
          <mat-form-field class="w-full">
            <mat-label>Delta (+ agregar / - quitar)</mat-label>
            <input matInput type="number" formControlName="delta" placeholder="ej. 5 o -3" />
            <mat-error *ngIf="form.get('delta')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <p class="text-sm text-gray-600">
            Nuevo stock:
            <strong [ngClass]="previewStock < 0 ? 'text-red-500' : ''">
              {{ previewStock }}
            </strong>
          </p>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="flex justify-end gap-2 mt-2">
        <button mat-button (click)="cancel()">Cancelar</button>
        <button
          mat-raised-button color="primary"
          (click)="submit()"
          [disabled]="form.invalid || previewStock < 0">
          Aplicar
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class StockMovementComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockMovementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SparePart
  ) {
    this.form = this.fb.group({
      delta: [0, [Validators.required]]
    });
  }

  get previewStock(): number {
    return this.data.stock + (this.form.get('delta')?.value ?? 0);
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.delta);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
