import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService, WalletData, WalletStatusResponse, RelayerCheckResponse } from '../../services/wallet.service';
import { NotificationService } from '../../services/notification.service';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { UserDetailModalComponent } from '../../shared/user-detail-modal/user-detail-modal.component';
import { PermissionService } from '../../core/auth/permission.service';

import { NotificationModalComponent } from '../../shared/notification-modal/notification-modal.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionHistoryComponent, UserDetailModalComponent, NotificationModalComponent],

  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent implements OnInit {
  @ViewChild(TransactionHistoryComponent) historyComponent!: TransactionHistoryComponent;

  walletData: WalletData | null = null;
  loading = true;
  error: string | null = null;
  hasWallet: boolean | null = null;
  isAdmin = false;

  // Fee inputs
  feeGas: string | null = null;
  editFeeMode = false;
  newFeeAmount = '';
  updatingFee = false;

  // Transfer RT inputs
  recipientAddress = '';
  transferAmount = '';
  transferringRT = false;

  // Mint BT inputs
  mintAmount = '';
  mintingBT = false;

  // Relayer check inputs
  checkAddress = '';
  relayerCheckResult: boolean | null = null;
  checkingRelayer = false;

  // Relayer permission management
  relayerAddress = '';
  updatingRelayer = false;

  // User wallet search
  searchUserAddress = '';
  searchResultData: WalletData | null = null;
  searchingUser = false;
  showUserDetailModal = false;

  constructor(
    private walletService: WalletService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWalletExistence();
      this.checkAdminRole();
    }
  }

  checkAdminRole(): void {
    // Check for wallet admin permission using PermissionService
    this.isAdmin = this.permissionService.hasPermission('quan_ly_vi', 'create');
    console.log('User isAdmin:', this.isAdmin);
  }

  checkWalletExistence(): void {
    this.loading = true;
    this.walletService.getWalletStatus().subscribe({
      next: (response: WalletStatusResponse) => {
        if (response.status === 200) {
          const status = response.data;
          this.hasWallet = status.hasWallet;

          if (status.hasWallet && status.hasPin) {
            // Đã có ví và đã có PIN -> Load dữ liệu bình thường
            this.fetchWalletData();
            this.fetchFee();
          } else {
            // Chưa có ví HOẶC đã có ví nhưng chưa có PIN -> Điều hướng sang trang tạo PIN
            this.router.navigate(['/wallet/pin']);
            this.loading = false;
          }
        } else {
          this.error = response.message || 'Lỗi kiểm tra trạng thái ví';
          this.loading = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error checking wallet status:', err);
        this.error = 'Không thể kết nối tới server. Vui lòng thử lại sau.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchWalletData(): void {
    this.loading = true;
    this.walletService.getWalletInfo().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.walletData = response.data;
        } else {
          this.error = response.message || 'Failed to fetch wallet data';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Không kết nối đc tới server blockchain';
        } else {
          this.error = 'Bạn chưa có tài khoản. Vui lòng đăng ký tài khoản trước khi sử dụng dịch vụ.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchFee(): void {
    this.walletService.getFee().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.feeGas = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching fee gas:', err);
      }
    });
  }

  toggleEditFee(): void {
    this.editFeeMode = !this.editFeeMode;
    if (this.editFeeMode) {
      // Extract number from "20%"
      this.newFeeAmount = this.feeGas ? this.feeGas.replace('%', '') : '';
    }
  }

  updateFee(): void {
    const feeValue = Number(this.newFeeAmount);
    if (!this.newFeeAmount || isNaN(feeValue)) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập phần trăm phí hợp lệ (ví dụ: 20).');
      return;
    }
    if (feeValue < 0 || feeValue > 100) {
      this.notificationService.showWarning('Thông báo', 'Phí dịch vụ phải nằm trong khoảng từ 0% đến 100%.');
      return;
    }

    this.updatingFee = true;
    this.walletService.setFee(this.newFeeAmount).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.notificationService.showSuccess('Thành công', response.message || 'Thay đổi phí thành công');
          this.feeGas = this.newFeeAmount + "%";
          this.editFeeMode = false;
          this.clearInputsAndRefresh();
        } else {
          this.notificationService.showError('Thất bại', response.message || 'Thay đổi phí không thành công.');
        }
        this.updatingFee = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating fee:', err);
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API cấu hình phí.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.updatingFee = false;
        this.cdr.detectChanges();
      }
    });
  }

  checkRelayerPermission(): void {
    if (!this.checkAddress) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập địa chỉ ví cần kiểm tra.');
      return;
    }

    this.checkingRelayer = true;

    this.walletService.checkRelayerPermission(this.checkAddress).subscribe({
      next: (response: RelayerCheckResponse) => {
        if (response.status === 200 || response.status === undefined) {
          if (response.data) {
            this.notificationService.showSuccess('Kết quả', 'Tài khoản ví đang là relayer');
          } else {
            this.notificationService.showError('Kết quả', 'Tài khoản ví không phải là ví relayer');
          }
        } else {
          this.notificationService.showError('Thất bại', 'Không thể kiểm tra quyền. Lỗi từ hệ thống: ' + response.message);
        }
        this.checkingRelayer = false;
        this.clearInputsAndRefresh();
      },
      error: (err) => {
        console.error('Error checking relayer permission:', err);
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API. Vui lòng kiểm tra console.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.checkingRelayer = false;
        this.cdr.detectChanges();
      }
    });
  }

  setRelayerPermission(allowed: boolean): void {
    if (!this.relayerAddress) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập địa chỉ ví.');
      return;
    }

    this.updatingRelayer = true;
    this.walletService.grantRevokeRelayer(this.relayerAddress, allowed).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.notificationService.showSuccess('Thành công', response.message || 'Thay đổi quyền relayer cho ví thành công');
          this.clearInputsAndRefresh();
        } else {
          this.notificationService.showError('Thất bại', response.message || 'Thay đổi quyền relayer không thành công.');
        }
        this.updatingRelayer = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating relayer permission:', err);
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.updatingRelayer = false;
        this.cdr.detectChanges();
      }
    });
  }

  onTransferRT(): void {
    if (!this.walletData?.address) {
      this.notificationService.showError('Lỗi', 'Không tìm thấy địa chỉ ví gửi.');
      return;
    }

    if (!this.recipientAddress) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập địa chỉ người nhận.');
      return;
    }

    const amount = Number(this.transferAmount);
    if (!this.transferAmount || isNaN(amount) || amount <= 0) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập số lượng RT hợp lệ.');
      return;
    }

    this.transferringRT = true;
    this.walletService.transferRT(this.walletData.address, this.recipientAddress, amount).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.notificationService.showSuccess('Thành công', response.message || 'Chuyển thành công');
          this.fetchWalletData(); // Refresh balances
          this.clearInputsAndRefresh();
        } else {
          this.notificationService.showError('Thất bại', response.message || 'Chuyển token không thành công.');
        }
        this.transferringRT = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error transferring RT:', err);
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API chuyển Token.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.transferringRT = false;
        this.cdr.detectChanges();
      }
    });
  }

  isValidAddress(address: string): boolean {
    // Ethereum address: 0x followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  fetchUserDetailInfo(): void {
    if (!this.searchUserAddress) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập địa chỉ ví cần tra cứu.');
      return;
    }

    if (!this.isValidAddress(this.searchUserAddress)) {
      this.notificationService.showWarning('Thông báo', 'Địa chỉ ví không hợp lệ. Vui lòng nhập địa chỉ ví bắt đầu bằng 0x và có 42 ký tự.');
      return;
    }

    this.searchingUser = true;
    this.walletService.getUserInfoByAddress(this.searchUserAddress).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.searchResultData = response.data;
          this.showUserDetailModal = true;
          this.clearInputsAndRefresh();
        } else {
          this.searchResultData = null;
          this.notificationService.showError('Thất bại', response.message || 'Không tìm thấy thông tin ví cho địa chỉ này.');
        }
        this.searchingUser = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user detail info:', err);
        this.searchResultData = null;
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API tra cứu.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.searchingUser = false;
        this.cdr.detectChanges();
      }
    });
  }

  onMintBT(): void {
    if (!this.mintAmount || parseFloat(this.mintAmount) <= 0) {
      this.notificationService.showWarning('Thông báo', 'Vui lòng nhập số lượng BT hợp lệ.');
      return;
    }

    this.mintingBT = true;
    this.walletService.mintBT(this.mintAmount).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.notificationService.showSuccess('Mint thành công', 'Đã tạo thêm token thành công');
          this.fetchWalletData();
          this.clearInputsAndRefresh();
        } else {
          this.notificationService.showError('Thất bại', 'Mint BT không thành công: ' + (response.message || 'Lỗi không xác định'));
        }
        this.mintingBT = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error minting BT:', err);
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi gọi API Mint BT.';
        this.notificationService.showError('Lỗi', errorMsg);
        this.mintingBT = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatBalance(value: string): string {
    if (!value) return '0';
    return parseFloat(value).toLocaleString();
  }

  clearInputsAndRefresh(): void {
    // Trigger history refresh
    if (this.historyComponent) {
      this.historyComponent.fetchTransactions();
    }

    // Reset inputs
    this.newFeeAmount = '';
    this.recipientAddress = '';
    this.transferAmount = '';
    this.mintAmount = '';
    this.relayerAddress = '';
    this.checkAddress = '';
    this.searchUserAddress = '';
    this.cdr.detectChanges();
  }
}
