import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService, PinRequest } from '../../services/wallet.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.scss'
})
export class PinComponent {
  pin = '';
  confirmPin = '';
  loading = false;

  constructor(
    private walletService: WalletService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  onPinChange(field: 'pin' | 'confirmPin'): void {
    this[field] = this[field].replace(/[^\d]/g, '');
  }

  blockNonNumeric(event: KeyboardEvent): void {
    const isNumber = /^[0-9]$/i.test(event.key);
    if (!isNumber && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'Enter') {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (!this.pin || !this.confirmPin) {
      console.log('PinComponent: Missing PIN fields');
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập đầy đủ mã PIN.');
      return;
    }

    if (this.pin !== this.confirmPin) {
      console.log('PinComponent: PIN mismatch');
      this.notificationService.showError('Lỗi', 'Mã PIN không khớp nhau.');
      return;
    }

    if (this.pin.length < 6) {
      console.log('PinComponent: PIN too short');
      this.notificationService.showError('Lỗi', 'Mã PIN phải có ít nhất 6 chữ số.');
      return;
    }

    const request: PinRequest = {
      pin: this.pin,
      confirmPin: this.confirmPin
    };

    this.loading = true;
    this.walletService.createWallet(request).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === undefined) {
          this.notificationService.showSuccess(
            'Thành công',
            'Đã tạo ví và mã PIN thành công. Địa chỉ ví: ' + response.data,
            'Đồng ý',
            () => {
              this.router.navigate(['/wallet']);
            }
          );
        } else {
          this.notificationService.showError('Thất bại', response.message || 'Tạo ví không thành công.');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('PinComponent: Error creating wallet', err);
        const errorMsg = err.error?.message || err.message || 'Có lỗi xảy ra khi tạo ví. Vui lòng thử lại sau.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.loading = false;
      }
    });
  }
}
