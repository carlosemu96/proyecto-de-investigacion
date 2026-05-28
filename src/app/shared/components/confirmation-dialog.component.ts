import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title class="flex items-center gap-2">
        <mat-icon class="text-warn-500 text-orange-500">warning</mat-icon>
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <p class="text-gray-600 mt-2">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="flex justify-end gap-2 mt-4">
        <button mat-button (click)="cancel()">Cancelar</button>
        <button
          mat-raised-button
          [color]="data.confirmColor || 'warn'"
          (click)="confirm()">
          {{ data.confirmLabel || 'Eliminar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
