import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Full-area loading spinner overlay.
 * Usage: <app-loading-spinner [loading]="isLoading" />
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <!-- Overlay shown while loading is true -->
    <div
      *ngIf="loading"
      class="absolute inset-0 flex items-center justify-center z-20 bg-white/70"
      style="backdrop-filter: blur(2px);">
      <mat-spinner [diameter]="diameter"></mat-spinner>
    </div>
  `
})
export class LoadingSpinnerComponent {
  /** Controls whether the spinner overlay is visible */
  @Input() loading = false;

  /** Spinner circle diameter in pixels */
  @Input() diameter = 48;
}
