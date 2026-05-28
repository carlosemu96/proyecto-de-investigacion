/** Vehicle entity returned by the API */
export interface Vehicle {
  id: string;
  /** License plate number */
  plate: string;
  brand: string;
  model: string;
  year: number;
  /** Current odometer reading in km */
  currentMileage: number;
  /** Lifecycle status, e.g. ACTIVE | MAINTENANCE | INACTIVE */
  status: string;
}

/** Mock vehicles used for UI development before API integration */
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    currentMileage: 45000,
    status: 'ACTIVE'
  },
  {
    id: '2',
    plate: 'XYZ-5678',
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    currentMileage: 62000,
    status: 'MAINTENANCE'
  },
  {
    id: '3',
    plate: 'DEF-9101',
    brand: 'Ford',
    model: 'Transit',
    year: 2021,
    currentMileage: 31000,
    status: 'ACTIVE'
  },
  {
    id: '4',
    plate: 'GHI-1123',
    brand: 'Chevrolet',
    model: 'Silverado',
    year: 2018,
    currentMileage: 88000,
    status: 'INACTIVE'
  }
];
