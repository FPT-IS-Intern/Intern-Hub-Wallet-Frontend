import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';

  constructor() {}

  /**
   * Get the access token from local storage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token') || localStorage.getItem(this.TOKEN_KEY);
      if (!token) return null;

      // In case the token is stored as a JSON string (e.g. "actual_token")
      if (token.startsWith('"') && token.endsWith('"')) {
        try {
          return JSON.parse(token);
        } catch (e) {
          return token;
        }
      }
      return token;
    }
    return null;
  }

  /**
   * Save the access token to local storage
   * @param token The token to save
   */
  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Remove the access token from local storage
   */
  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Check if a token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}
