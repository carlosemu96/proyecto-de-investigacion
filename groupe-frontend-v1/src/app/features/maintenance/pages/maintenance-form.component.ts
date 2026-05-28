import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MaintenanceRecord } from '../../../core/models/maintenance-record.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>{{ isEdit ? 'Editar Registro de Mantenimiento' : 'Nuevo Registro de Mantenimiento' }}</h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="grid grid-cols-1 gap-4 mt-2">

          <mat-form-field class="w-full">
            <mat-label>Vehículo</mat-label>
            <input
              matInput
              [formControl]="vehicleSearchControl"
              [matAutocomplete]="vehicleAuto"
              placeholder="Buscar por placa, marca, modelo, año, estado o ID" />
            <mat-progress-spinner
              *ngIf="loadingVehicles"
              matSuffix
              diameter="20"
              mode="indeterminate" />
            <mat-autocomplete #vehicleAuto="matAutocomplete" (optionSelected)="onVehicleSelected($event.option.value)">
              <mat-option *ngFor="let vehicle of filteredVehicles" [value]="vehicle.id">
                <div class="flex flex-col leading-tight py-1">
                  <span>{{ vehicleLabel(vehicle) }}</span>
                  <span class="text-xs text-gray-500">ID {{ vehicle.id }} - {{ vehicle.status }}</span>
                </div>
              </mat-option>
              <mat-option *ngIf="!loadingVehicles && filteredVehicles.length === 0" disabled>
                No se encontraron vehículos
              </mat-option>
            </mat-autocomplete>
            <mat-hint *ngIf="vehicleLoadError" class="text-red-600">{{ vehicleLoadError }}</mat-hint>
            <mat-error *ngIf="form.get('vehicleId')?.hasError('required')">Seleccione un vehículo existente</mat-error>
            <mat-error *ngIf="form.get('vehicleId')?.hasError('unknownVehicle')">Seleccione un vehículo de la lista</mat-error>
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
        <button mat-raised-button color="primary" (click)="submit()" [disabled]="form.invalid || loadingVehicles">
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class MaintenanceFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  vehicleSearchControl = new FormControl('', { nonNullable: true });
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  loadingVehicles = false;
  vehicleLoadError = '';

  private selectedVehicle: Vehicle | null = null;
  private destroy$ = new Subject<void>();

  get isEdit(): boolean {
    return !!this.data;
  }

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private dialogRef: MatDialogRef<MaintenanceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MaintenanceRecord | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vehicleId:        [this.data?.vehicleId ?? '',         [Validators.required, (control: AbstractControl) => this.existingVehicleValidator(control)]],
      type:             [this.data?.type ?? 'PREVENTIVE'],
      plannedDate:      [this.data?.plannedDate ?? '',       Validators.required],
      completedDate:    [this.data?.completedDate ?? ''],
      mileageAtService: [this.data?.mileageAtService ?? 0],
      totalCost:        [this.data?.totalCost ?? 0],
      sparePartIds:     [this.data?.sparePartIds ?? []],
      status:           [this.data?.status ?? 'PLANNED'],
      notes:            [this.data?.notes ?? '']
    });

    if (this.data?.vehicleId) {
      this.vehicleSearchControl.setValue(this.data.vehicleId, { emitEvent: false });
    }

    this.vehicleSearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (!this.selectedVehicle || value !== this.vehicleLabel(this.selectedVehicle)) {
          this.selectedVehicle = null;
          this.form.get('vehicleId')?.setValue('');
        }
        this.filterVehicles(value);
      });

    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicles(): void {
    this.loadingVehicles = true;
    this.vehicleLoadError = '';

    this.vehicleService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: vehicles => {
          this.vehicles = vehicles;
          this.filteredVehicles = vehicles;
          this.loadingVehicles = false;
          this.preselectVehicle();
          this.form.get('vehicleId')?.updateValueAndValidity();
        },
        error: () => {
          this.vehicles = [];
          this.filteredVehicles = [];
          this.loadingVehicles = false;
          this.vehicleLoadError = 'Error al cargar vehículos';
          this.form.get('vehicleId')?.updateValueAndValidity();
        }
      });
  }

  onVehicleSelected(vehicleId: string): void {
    const vehicle = this.vehicles.find(v => v.id === vehicleId) ?? null;
    this.selectedVehicle = vehicle;
    this.form.get('vehicleId')?.setValue(vehicle?.id ?? '');
    this.form.get('vehicleId')?.updateValueAndValidity();
    this.vehicleSearchControl.setValue(vehicle ? this.vehicleLabel(vehicle) : '', { emitEvent: false });
    this.filteredVehicles = this.vehicles;
  }

  vehicleLabel(vehicle: Vehicle): string {
    return `${vehicle.plate} - ${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
  }

  private filterVehicles(value: string): void {
    const term = value.trim().toLowerCase();
    if (!term) {
      this.filteredVehicles = this.vehicles;
      return;
    }

    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const searchable = [
        vehicle.plate,
        vehicle.brand,
        vehicle.model,
        vehicle.year.toString(),
        vehicle.status,
        vehicle.id
      ].join(' ').toLowerCase();

      return searchable.includes(term);
    });
  }

  private preselectVehicle(): void {
    if (!this.data?.vehicleId) {
      return;
    }

    const vehicle = this.vehicles.find(v => v.id === this.data!.vehicleId) ?? null;
    this.selectedVehicle = vehicle;
    if (vehicle) {
      this.vehicleSearchControl.setValue(this.vehicleLabel(vehicle), { emitEvent: false });
    }
  }

  private existingVehicleValidator(control: AbstractControl): ValidationErrors | null {
    const vehicleId = control.value as string;
    if (!vehicleId) {
      return null;
    }

    return this.vehicles.some(vehicle => vehicle.id === vehicleId) ? null : { unknownVehicle: true };
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
