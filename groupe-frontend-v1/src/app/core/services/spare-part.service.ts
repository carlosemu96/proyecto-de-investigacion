import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { SparePart, MOCK_SPARE_PARTS } from '../models/spare-part.model';

@Injectable({ providedIn: 'root' })
export class SparePartService {
  private apiUrl = `${environment.apiUrl}/spare-parts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SparePart[]> {
    if (environment.useMockData) return of(MOCK_SPARE_PARTS);
    return this.http.get<SparePart[]>(this.apiUrl);
  }

  getById(id: string): Observable<SparePart> {
    if (environment.useMockData) {
      return of(MOCK_SPARE_PARTS.find(p => p.id === id) ?? MOCK_SPARE_PARTS[0]);
    }
    return this.http.get<SparePart>(`${this.apiUrl}/${id}`);
  }

  getLowStock(): Observable<SparePart[]> {
    if (environment.useMockData) {
      return of(MOCK_SPARE_PARTS.filter(p => p.stock < p.minStock));
    }
    return this.http.get<SparePart[]>(`${this.apiUrl}/low-stock`);
  }

  create(part: Omit<SparePart, 'id'>): Observable<SparePart> {
    if (environment.useMockData) {
      return of({ ...part, id: Date.now().toString() });
    }
    return this.http.post<SparePart>(this.apiUrl, part);
  }

  update(id: string, part: SparePart): Observable<SparePart> {
    if (environment.useMockData) return of(part);
    return this.http.put<SparePart>(`${this.apiUrl}/${id}`, part);
  }

  adjustStock(id: string, delta: number): Observable<SparePart> {
    if (environment.useMockData) {
      const part = MOCK_SPARE_PARTS.find(p => p.id === id) ?? MOCK_SPARE_PARTS[0];
      return of({ ...part, stock: part.stock + delta });
    }
    return this.http.patch<SparePart>(`${this.apiUrl}/${id}/stock?delta=${delta}`, null);
  }

  delete(id: string): Observable<void> {
    if (environment.useMockData) return of(void 0);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
