import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Alert, MOCK_ALERTS } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private apiUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) {}

  getAll(openOnly = false): Observable<Alert[]> {
    if (environment.useMockData) {
      const alerts = openOnly
        ? MOCK_ALERTS.filter(a => a.status === 'OPEN')
        : MOCK_ALERTS;
      return of(alerts);
    }
    return this.http.get<Alert[]>(`${this.apiUrl}?openOnly=${openOnly}`);
  }

  getById(id: string): Observable<Alert> {
    if (environment.useMockData) {
      return of(MOCK_ALERTS.find(a => a.id === id) ?? MOCK_ALERTS[0]);
    }
    return this.http.get<Alert>(`${this.apiUrl}/${id}`);
  }

  create(alert: Omit<Alert, 'id' | 'createdAt' | 'resolvedAt'>): Observable<Alert> {
    if (environment.useMockData) {
      return of({
        ...alert,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        resolvedAt: ''
      });
    }
    return this.http.post<Alert>(this.apiUrl, alert);
  }

  updateStatus(id: string, status: string): Observable<Alert> {
    if (environment.useMockData) {
      const alert = MOCK_ALERTS.find(a => a.id === id) ?? MOCK_ALERTS[0];
      return of({ ...alert, status, resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : '' });
    }
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/status?status=${status}`, null);
  }

  delete(id: string): Observable<void> {
    if (environment.useMockData) return of(void 0);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
