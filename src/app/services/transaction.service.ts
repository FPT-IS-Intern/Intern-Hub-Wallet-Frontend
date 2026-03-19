import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionHistoryResponse } from '../models/transaction.model';
import { getBaseUrl } from '../core/config/app-config';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private get historyUrl() { return `${getBaseUrl()}/wl/transaction/history`; }

  constructor(private http: HttpClient) {}

  getTransactionHistory(page: number = 0, size: number = 10): Observable<TransactionHistoryResponse> {
    return this.http.get<TransactionHistoryResponse>(this.historyUrl, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
