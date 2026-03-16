import { Routes } from '@angular/router';
import { WalletComponent } from './components/wallet/wallet.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { PinComponent } from './components/pin/pin.component';

export const routes: Routes = [
  { path: 'wallet', component: WalletComponent },
  { path: 'transaction', component: TransactionHistoryComponent },
  { path: 'pin', component: PinComponent },
  { path: '', redirectTo: 'wallet', pathMatch: 'full' }
];
