import { Routes } from '@angular/router';
import { WalletComponent } from './features/wallet/wallet.component';
import { TransactionHistoryComponent } from './features/transaction-history/transaction-history.component';
import { PinComponent } from './features/pin/pin.component';

export const routes: Routes = [
  { path: '', component: WalletComponent },
  { path: 'transaction', component: TransactionHistoryComponent },
  { path: 'pin', component: PinComponent },
];
