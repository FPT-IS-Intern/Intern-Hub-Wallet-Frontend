import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WalletData {
  address: string;
  bt: string;
  rt: string;
  lockedBalance: string;
}

export interface WalletResponse {
  status: number;
  message: string;
  data: WalletData;
}

export interface RelayerCheckResponse {
  status: number;
  message: string;
  data: boolean;
}

export interface PinRequest {
  pin: string;
  confirmPin: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = '/wl/user';
  private relayerUrl = '/wl/address/allowedrelayrs';
  private mintUrl = '/wl/blockchain/mint';
  private feeUrl = '/wl/blockchain/fee-gas';
  private transferUrl = '/wl/blockchain/transfer';
  private grantRevokeRelayerUrl = '/wl/relayer';
  private createUrl = '/wl/create';

  constructor(private http: HttpClient) {}

  getWalletInfo(): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(this.apiUrl);
  }

  checkRelayerPermission(address: string): Observable<RelayerCheckResponse> {
    return this.http.get<RelayerCheckResponse>(`${this.relayerUrl}/${address}`);
  }

  mintBT(amount: string): Observable<any> {
    return this.http.post(this.mintUrl, null, { params: { amount: amount } });
  }

  getFee(): Observable<any> {
    return this.http.get(this.feeUrl);
  }

  setFee(fee: string): Observable<any> {
    return this.http.post(this.feeUrl, { fee: fee });
  }

  transferRT(fromAddress: string, toAddress: string, amount: number): Observable<any> {
    const payload = {
      fromAddress: fromAddress,
      toAddress: toAddress,
      amount: amount
    };
    return this.http.post(this.transferUrl, payload);
  }

  grantRevokeRelayer(address: string, allowed: boolean): Observable<any> {
    const payload = {
      address: address,
      allowed: allowed.toString()
    };
    return this.http.post(this.grantRevokeRelayerUrl, payload);
  }

  getUserInfoByAddress(address: string): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`/wl/user/${address}`);
  }

  createWallet(request: PinRequest): Observable<any> {
    return this.http.post(this.createUrl, request);
  }
}
