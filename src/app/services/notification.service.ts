import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'warning' | 'error' | 'confirm';

export interface NotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  state = signal<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  countdown = signal<number>(0);
  private timerId: any = null;

  showSuccess(
    title: string,
    message: string = '',
    confirmText: string = 'Đóng',
    onConfirm?: () => void,
    autoClose: boolean = false
  ) {
    console.log('NotificationService: showSuccess triggered', { title, message });
    this.clearTimer();
    const newState: NotificationState = {
      show: true,
      type: 'success',
      title,
      message,
      confirmText,
      onConfirm
    };
    this.state.set(newState);
    this.dispatchToWindow(newState);

    if (autoClose) {
      this.startCountdown(3, onConfirm);
    } else {
      this.countdown.set(0);
    }
  }

  showError(
    title: string,
    message: string = '',
    confirmText: string = 'Đồng ý',
    cancelText: string = 'Quay lại',
    onConfirm?: () => void,
    onCancel?: () => void
  ) {
    console.log('NotificationService: showError triggered', { title, message });
    this.clearTimer();
    const newState: NotificationState = {
      show: true,
      type: 'error',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.state.set(newState);
    this.dispatchToWindow(newState);
    this.countdown.set(0);
  }

  showConfirm(
    title: string,
    message: string = '',
    confirmText: string = 'Xác nhận',
    cancelText: string = 'Thoát',
    onConfirm?: () => void,
    onCancel?: () => void
  ) {
    console.log('NotificationService: showConfirm triggered', { title, message });
    this.clearTimer();
    const newState: NotificationState = {
      show: true,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.state.set(newState);
    this.dispatchToWindow(newState);
    this.countdown.set(0);
  }

  showWarning(
    title: string,
    message: string = '',
    confirmText: string = 'Xác nhận',
    cancelText: string = 'Thoát',
    onConfirm?: () => void,
    onCancel?: () => void
  ) {
    console.log('NotificationService: showWarning triggered', { title, message });
    this.clearTimer();
    const newState: NotificationState = {
      show: true,
      type: 'warning',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.state.set(newState);
    this.dispatchToWindow(newState);
    this.countdown.set(0);
  }

  showInput(
    title: string,
    message: string = '',
    inputPlaceholder: string = 'Nhập nội dung...',
    confirmText: string = 'Xác nhận',
    cancelText: string = 'Thoát',
    onConfirm?: (value?: string) => void,
    onCancel?: () => void
  ) {
    console.log('NotificationService: showInput triggered', { title, message });
    this.clearTimer();
    const newState: NotificationState = {
      show: true,
      type: 'confirm',
      title,
      message,
      showInput: true,
      inputPlaceholder,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.state.set(newState);
    this.dispatchToWindow(newState);
    this.countdown.set(0);
  }

  close() {
    console.log('NotificationService: close triggered');
    this.clearTimer();
    this.state.update(s => ({ ...s, show: false }));
    this.dispatchToWindow({ show: false } as any);
  }

  private startCountdown(seconds: number, callback?: () => void) {
    this.countdown.set(seconds);
    this.timerId = setInterval(() => {
      this.countdown.update(c => c - 1);
      if (this.countdown() <= 0) {
        if (callback) callback();
        this.close();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private dispatchToWindow(state: NotificationState) {
    window.dispatchEvent(new CustomEvent('WINDOW_NOTIFICATION', { detail: state }));
  }
}
