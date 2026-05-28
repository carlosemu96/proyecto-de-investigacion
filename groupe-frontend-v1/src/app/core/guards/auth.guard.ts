import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { KeycloakService } from '../../features/auth/keycloak.service';
import { environment } from 'environments/environment';

export const authGuard = () => {
  if (environment.useMockData) {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) return true;

    router.navigate(['/auth/login']);
    return false;
  }

  const keycloakService = inject(KeycloakService);

  if (keycloakService.isLoggedIn()) return true;

  keycloakService.login();
  return false;
};
