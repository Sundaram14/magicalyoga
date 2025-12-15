import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Use the public currentUser getter
  const currentUser = authService.currentUser;
  
  if (currentUser && currentUser.role === 'admin') {
    return true;
  }
  
  // Redirect to dashboard if not admin
  router.navigate(['/admin']);
  return false;
};