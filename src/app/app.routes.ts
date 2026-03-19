import { Routes } from '@angular/router';
import { WalletComponent } from './features/wallet/wallet.component';
import { TransactionHistoryComponent } from './features/transaction-history/transaction-history.component';
import { PinComponent } from './features/pin/pin.component';
import { permissionGuard } from './core/auth/permission.guard';

const walletRoutes: Routes = [
  { 
    path: '', 
    component: WalletComponent
  },
  { 
    path: 'transaction', 
    component: TransactionHistoryComponent
  },
  { 
    path: 'pin', 
    component: PinComponent
  }
];

export const routes: Routes = [
  {
    path: '',
    children: walletRoutes
  },
  {
    path: 'wallet',
    children: walletRoutes
  }
];
