import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletData } from '../../services/wallet.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail-modal.component.html',
  styleUrl: './user-detail-modal.component.scss'
})
export class UserDetailModalComponent {
  @Input() walletData: WalletData | null = null;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  constructor(private notificationService: NotificationService) {}

  onClose(): void {
    this.close.emit();
  }

  formatBalance(balance: string | undefined): string {
    if (!balance) return '0';
    const num = parseFloat(balance);
    return num.toLocaleString('vi-VN');
  }

  copyToClipboard(text: string, message: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.showSuccess('Thành công', message);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      this.notificationService.showError('Lỗi', 'Không thể copy địa chỉ.');
    });
  }
}
