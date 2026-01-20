import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * 
 * Protects /admin/** routes by checking authentication state.
 * Redirects unauthenticated users to /admin/login with returnUrl.
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for AuthService to restore session from Supabase/localStorage
  await authService.waitForSessionInit();

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  const returnUrl = state.url;
  return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl } });
};
