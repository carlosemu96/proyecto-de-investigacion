import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MaintenanceRecord, MOCK_MAINTENANCE_RECORDS } from '../models/maintenance-record.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private apiUrl = `${environment.apiUrl}/maintenance-records`;

  constructor(private http: HttpClient) {}

  getAll(overdue = false): Observable<MaintenanceRecord[]> {
    if (environment.useMockData) {
      const records = overdue
        ? MOCK_MAINTENANCE_RECORDS.filter(r => r.status === 'OVERDUE')
        : MOCK_MAINTENANCE_RECORDS;
      return of(records);
    }
    return this.http.get<MaintenanceRecord[]>(`${this.apiUrl}?overdue=${overdue}`);
  }

  getById(id: string): Observable<MaintenanceRecord> {
    if (environment.useMockData) {
      return of(MOCK_MAINTENANCE_RECORDS.find(r => r.id === id) ?? MOCK_MAINTENANCE_RECORDS[0]);
    }
    return this.http.get<MaintenanceRecord>(`${this.apiUrl}/${id}`);
  }

  create(record: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Observable<MaintenanceRecord> {
    if (environment.useMockData) {
      return of({ ...record, id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    return this.http.post<MaintenanceRecord>(this.apiUrl, record);
  }

  update(id: string, record: MaintenanceRecord): Observable<MaintenanceRecord> {
    if (environment.useMockData) return of(record);
    return this.http.put<MaintenanceRecord>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: string): Observable<void> {
    if (environment.useMockData) return of(void 0);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
