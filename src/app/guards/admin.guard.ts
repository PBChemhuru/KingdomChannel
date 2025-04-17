import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = sessionStorage.getItem('jwtToken');
  if (token) {
    const user = authService.getUserInfoFromToken(token);
    if (user?.role === 'admin') {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  router.navigate(['/']);
  return false;
};
