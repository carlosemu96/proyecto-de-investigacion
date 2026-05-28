import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Empty-state placeholder displayed when a list has no items.
 * Usage: <app-empty-state icon="directions_car" message="No vehicles found." />
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-gray-400">
      <!-- Contextual icon -->
      <mat-icon class="text-6xl mb-4" style="font-size: 64px; width: 64px; height: 64px;">
        {{ icon }}
      </mat-icon>
      <!-- Primary message -->
      <p class="text-lg font-medium">{{ message }}</p>
      <!-- Optional sub-text -->
      <p *ngIf="subMessage" class="text-sm mt-1">{{ subMessage }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  /** Material icon name to display */
  @Input() icon = 'inbox';
  /** Main message shown below the icon */
  @Input() message = 'No items found.';
  /** Optional secondary message */
  @Input() subMessage = '';
}
