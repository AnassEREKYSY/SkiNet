import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  busyService = inject(BusyService);
  /** Title of the empty state. */
  message = input.required<string>();
  /** Optional supporting line under the title. */
  description = input<string>('');
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();

  onAction() {
    this.action.emit();
  }
}
