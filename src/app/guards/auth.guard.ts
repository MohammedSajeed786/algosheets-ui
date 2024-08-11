import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  let jwtService = inject(JwtService);
  let router = inject(Router);
  let token = localStorage.getItem('token');
  let isTokenValid = token != null && jwtService.isTokenValid(token);

  let path = route.routeConfig?.path;

  if (path == 'login') {
    if (!isTokenValid) return true;
    else router.navigate(['home']);
  } else {
    if (isTokenValid) return true;
    else router.navigate(['login']);
  }
  return false;
};
