import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from 'environments/environment';
import { KeycloakService } from '../../features/auth/keycloak.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.useMockData) {
      return next.handle(req);
    }

    return from(this.keycloakService.getValidToken()).pipe(
      switchMap(token => {
        let modified = req;

        if (req.url.startsWith('/')) {
          modified = modified.clone({ url: environment.apiUrl + req.url });
        }

        if (token) {
          modified = modified.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }

        return next.handle(modified);
      })
    );
  }
}
