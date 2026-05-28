import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { DashboardSummary, MOCK_DASHBOARD_SUMMARY } from '../models/dashboard-summary.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    if (environment.useMockData) return of(MOCK_DASHBOARD_SUMMARY);
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}
