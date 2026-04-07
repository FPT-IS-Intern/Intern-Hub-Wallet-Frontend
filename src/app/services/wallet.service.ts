import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBaseUrl } from '../core/config/app-config';

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

export interface WalletStatusData {
  hasWallet: boolean;
  hasPin: boolean;
  address: string | null;
  walletStatus: string | null;
}

export interface WalletStatusResponse {
  status: number;
  message: string;
  data: WalletStatusData;
}

export interface PinRequest {
  pin: string;
  confirmPin: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private get apiUrl() { return `${getBaseUrl()}/wl/user`; }
  private get relayerUrl() { return `${getBaseUrl()}/wl/address/allowedrelayrs`; }
  private get mintUrl() { return `${getBaseUrl()}/wl/blockchain/mint`; }
  private get feeUrl() { return `${getBaseUrl()}/wl/blockchain/fee-gas`; }
  private get transferUrl() { return `${getBaseUrl()}/wl/blockchain/transfer`; }
  private get exchangeUrl() { return `${getBaseUrl()}/wl/blockchain/exchange`; }
  private get grantRevokeRelayerUrl() { return `${getBaseUrl()}/wl/relayer`; }
  private get createUrl() { return `${getBaseUrl()}/wl/create`; }
  private get walletStatusUrl() { return `${getBaseUrl()}/wl/status`; }

  constructor(private http: HttpClient) {}

  getWalletStatus(): Observable<WalletStatusResponse> {
    return this.http.get<WalletStatusResponse>(this.walletStatusUrl);
  }

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

  exchangeRT(amount: number): Observable<any> {
    return this.http.post(this.exchangeUrl, { amount: amount });
  }

  grantRevokeRelayer(address: string, allowed: boolean): Observable<any> {
    const payload = {
      address: address,
      allowed: allowed.toString()
    };
    return this.http.post(this.grantRevokeRelayerUrl, payload);
  }

  getUserInfoByAddress(address: string): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${getBaseUrl()}/wl/user/${address}`);
  }

  getUserInfoByUserId(userId: string | number): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${getBaseUrl()}/wl/user/${userId}`);
  }

  createWallet(request: PinRequest): Observable<any> {
    return this.http.post(this.createUrl, request);
  }
}
