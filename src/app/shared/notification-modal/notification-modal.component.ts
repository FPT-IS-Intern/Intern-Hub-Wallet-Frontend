import { Component, inject, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationState } from '../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss'
})
export class NotificationModalComponent {
  notificationService = inject(NotificationService);
  state = this.notificationService.state;
  inputValue = signal('');

  @HostListener('window:WINDOW_NOTIFICATION', ['$event'])
  onWindowNotification(event: any) {
    const newState = event.detail as NotificationState;
    if (newState) {
      this.notificationService.state.set(newState);
    }
  }

  // Reset input when modal opens
  private _resetOnShow = effect(() => {
    if (this.state().show) {
      this.inputValue.set('');
    }
  }, { allowSignalWrites: true });

  onConfirm() {
    const currentState = this.state();
    if (currentState.onConfirm) {
      currentState.onConfirm(this.inputValue());
    }
    this.notificationService.close();
  }

  onCancel() {
    const currentState = this.state();
    if (currentState.onCancel) {
      currentState.onCancel();
    }
    this.notificationService.close();
  }
}
