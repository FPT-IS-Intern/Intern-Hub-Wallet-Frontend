import { Routes } from '@angular/router';
import { WalletComponent } from './features/wallet/wallet.component';
import { TransactionHistoryComponent } from './features/transaction-history/transaction-history.component';
import { PinComponent } from './features/pin/pin.component';
import { permissionGuard } from './core/auth/permission.guard';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';

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
    providers: [
      provideHttpClient(withInterceptors([authInterceptor]))
    ],
    children: walletRoutes
  },
  {
    path: 'wallet',
    providers: [
      provideHttpClient(withInterceptors([authInterceptor]))
    ],
    children: walletRoutes
  }
];
