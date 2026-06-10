import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { SparePart, MOCK_SPARE_PARTS } from '../models/spare-part.model';

@Injectable({ providedIn: 'root' })
export class SparePartService {
  private apiUrl = `${environment.apiUrl}/spare-parts`;

  constructor(private http: HttpClient) {}

  getAll(categories: string[] = []): Observable<SparePart[]> {
    const normalizedCategories = this.normalizeCategories(categories);
    if (environment.useMockData) {
      const parts = normalizedCategories.length
        ? MOCK_SPARE_PARTS.filter(part => normalizedCategories.includes(part.category))
        : MOCK_SPARE_PARTS;
      return of(parts);
    }

    let params = new HttpParams();
    normalizedCategories.forEach(category => {
      params = params.append('categories', category);
    });
    return this.http.get<SparePart[]>(this.apiUrl, { params });
  }

  getCategories(): Observable<string[]> {
    if (environment.useMockData) {
      const categories = Array.from(new Set(
        MOCK_SPARE_PARTS
          .map(part => part.category?.trim())
          .filter((category): category is string => !!category)
      )).sort();
      return of(categories);
    }
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
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

  private normalizeCategories(categories: string[]): string[] {
    return Array.from(new Set(
      categories
        .map(category => category.trim())
        .filter(category => !!category)
    ));
  }
}
