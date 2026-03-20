import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  page = signal(0);
  size = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  loading = signal(false);
  
  displayRange = computed(() => {
    if (this.totalElements() === 0) return '0-0';
    const start = this.page() * this.size() + 1;
    const end = Math.min((this.page() + 1) * this.size(), this.totalElements());
    return `${start}-${end}`;
  });

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(0);

      if (current > 2) {
        pages.push('...');
      }

      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (current < total - 3) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(total - 1)) {
        pages.push(total - 1);
      }
    }
    return pages;
  });

  constructor(
    private transactionService: TransactionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.loading.set(true);
    this.transactionService.getTransactionHistory(this.page(), this.size()).subscribe({
      next: (response) => {
        if (response && response.status === 200 && response.data) {
          const data = response.data;
          this.transactions.set(data.data || []);
          this.page.set(data.page ?? 0);
          this.size.set(data.size ?? 10);
          this.totalElements.set(data.totalElements ?? 0);
          this.totalPages.set(data.totalPages ?? 0);
          
        } else {
          const errMsg = response?.message || 'Unknown error';
          this.notificationService.showError('Lỗi', 'Lỗi khi tải lịch sử giao dịch: ' + errMsg);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError('Lỗi', 'Không thể kết nối đến máy chủ.');
        this.loading.set(false);
      }
    });
  }

  goToPage(p: number): void {
    if (p >= 0 && p < this.totalPages()) {
      this.page.set(p);
      this.fetchTransactions();
    }
  }

  // Removed getPages() in favor of computed 'pages' signal

  copyToClipboard(text: string, message: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.showSuccess('Thành công', message);

    }).catch(err => {
    });
  }

  shortenAddress(address: string): string {
    if (!address) return '';
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    return date.toLocaleDateString('vi-VN');
  }

  translateMethod(method: string): string {
    if (!method) return '-';
    
    const mappings: { [key: string]: string } = {
      'Set Fee Percent': 'Phí gas',
      'Save Project': 'Nhận dự án',
      'Save Module': 'Nhận dự án team',
      'Save Task': 'Nhận nhiệm vụ',
      'Approve Project': 'Duyệt dự án',
      'Approve Module': 'Duyệt dự án team',
      'Approve Task': 'Duyệt nhiệm vụ',
      'Mint': 'Tạo Token',
      'Transfer': 'Chuyển Token'
    };
    
    return mappings[method] || method;
  }
}
