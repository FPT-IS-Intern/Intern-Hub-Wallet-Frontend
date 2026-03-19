import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionAction, PermissionService } from './permission.service';

export const permissionGuard =
  (resource: string, action: PermissionAction, redirectTo: string = '/'): CanActivateFn =>
  () => {
    // Bypass guard for standalone local development testing to avoid redirect loops
    if (typeof window !== 'undefined' && window.location.port === '4220') {
      return true;
    }

    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (permissionService.hasPermission(resource, action)) {
      return true;
    }

    // Default redirect to home/dashboard if unauthorized
    return router.createUrlTree([redirectTo]);
  };
