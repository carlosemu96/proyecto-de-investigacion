import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloakUrl,
      realm: environment.keycloakRealm,
      clientId: environment.keycloakClientId
    });
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false
      });
      return authenticated;
    } catch (error) {
      console.warn('Keycloak init failed — funcionando sin autenticación real', error);
      return false;
    }
  }

  login(): void {
    this.keycloak.login({ redirectUri: window.location.origin + '/dashboard' });
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin + '/auth/login' });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async getValidToken(): Promise<string | undefined> {
    if (!this.keycloak.authenticated) return undefined;
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token;
    } catch {
      this.login();
      return undefined;
    }
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  getFullName(): string {
    const parsed = this.keycloak.tokenParsed as Record<string, any> | undefined;
    return parsed?.['name'] ?? this.getUsername();
  }
}
