import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'review' | 'admin';

interface TokenClaims {
  permissions?: string[] | null;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);

  hasPermission(resource: string, action: PermissionAction): boolean {
    return this.getPermissionSet().has(this.buildPermissionKey(resource, action));
  }

  hasAnyPermission(checks: ReadonlyArray<{ resource: string; action: PermissionAction }>): boolean {
    const permissions = this.getPermissionSet();
    return checks.some((check) => permissions.has(this.buildPermissionKey(check.resource, check.action)));
  }

  private getPermissionSet(): Set<string> {
    return new Set(this.extractPermissionsFromToken());
  }

  private extractPermissionsFromToken(): string[] {
    const token = this.authService.getToken();
    if (!token) {
      return [];
    }

    const claims = this.decodeTokenClaims(token);
    if (!claims?.permissions || !Array.isArray(claims.permissions)) {
      return [];
    }

    return claims.permissions.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  private decodeTokenClaims(token: string): TokenClaims | null {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
      const json = atob(paddedPayload);
      return JSON.parse(json) as TokenClaims;
    } catch {
      return null;
    }
  }

  private buildPermissionKey(resource: string, action: PermissionAction): string {
    return `${resource}:${action}`;
  }
}
