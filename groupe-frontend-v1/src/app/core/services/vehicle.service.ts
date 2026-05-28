import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Vehicle, MOCK_VEHICLES } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    if (environment.useMockData) return of(MOCK_VEHICLES);
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  getById(id: string): Observable<Vehicle> {
    if (environment.useMockData) {
      return of(MOCK_VEHICLES.find(v => v.id === id) ?? MOCK_VEHICLES[0]);
    }
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  create(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    if (environment.useMockData) {
      return of({ ...vehicle, id: Date.now().toString() });
    }
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  update(id: string, vehicle: Vehicle): Observable<Vehicle> {
    if (environment.useMockData) return of(vehicle);
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  }

  delete(id: string): Observable<void> {
    if (environment.useMockData) return of(void 0);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
