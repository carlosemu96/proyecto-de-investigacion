/** Spare part / inventory item returned by the API */
export interface SparePart {
  id: string;
  /** Stock keeping unit code */
  sku: string;
  name: string;
  /** Part category, e.g. ENGINE, BRAKES, FILTERS */
  category: string;
  /** Current stock quantity */
  stock: number;
  /** Minimum acceptable stock before alert is triggered */
  minStock: number;
  /** Unit cost in local currency */
  unitCost: number;
}

/** Mock spare parts for UI development */
export const MOCK_SPARE_PARTS: SparePart[] = [
  { id: '1', sku: 'FLT-001', name: 'Oil Filter', category: 'FILTERS', stock: 15, minStock: 10, unitCost: 8.50 },
  { id: '2', sku: 'BRK-001', name: 'Brake Pad Set', category: 'BRAKES', stock: 4, minStock: 6, unitCost: 45.00 },
  { id: '3', sku: 'ENG-001', name: 'Spark Plug', category: 'ENGINE', stock: 30, minStock: 20, unitCost: 5.00 },
  { id: '4', sku: 'TRS-001', name: 'Transmission Fluid', category: 'FLUIDS', stock: 2, minStock: 5, unitCost: 22.00 },
  { id: '5', sku: 'AIR-001', name: 'Air Filter', category: 'FILTERS', stock: 12, minStock: 8, unitCost: 12.75 }
];
