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
  private get grantRevokeRelayerUrl() { return `${getBaseUrl()}/wl/relayer`; }
  private get createUrl() { return `${getBaseUrl()}/wl/create`; }
  private get checkWalletExistsUrl() { return `${getBaseUrl()}/wl/exists`; }

  constructor(private http: HttpClient) {}

  checkWalletExists(): Observable<RelayerCheckResponse> {
    return this.http.get<RelayerCheckResponse>(this.checkWalletExistsUrl);
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

  createWallet(request: PinRequest): Observable<any> {
    return this.http.post(this.createUrl, request);
  }
}
