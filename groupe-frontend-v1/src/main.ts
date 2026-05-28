import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { ApiInterceptor } from './app/core/interceptors';
import { KeycloakService } from './app/features/auth/keycloak.service';
import { environment } from 'environments/environment';

function initKeycloak(keycloakService: KeycloakService) {
  return () => {
    if (environment.useMockData) return Promise.resolve();
    return keycloakService.init();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [KeycloakService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
