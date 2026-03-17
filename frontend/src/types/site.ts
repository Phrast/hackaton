export interface Material {
  id: number;
  name: string;
  emissionFactor: number;
  unit: string;
  category: string;
  description: string | null;
  source: string;
}

export interface SiteMaterial {
  id: number;
  materialId: number;
  materialName: string;
  category: string;
  emissionFactor: number;
  unit: string;
  quantityKg: number;
  co2Kg: number;
}

export interface Calculation {
  id: number;
  siteId: number;
  siteName: string;
  constructionCo2Kg: number;
  exploitationCo2Kg: number;
  totalCo2Kg: number;
  co2PerM2: number | null;
  co2PerEmployee: number | null;
  calculatedAt: string;
}

export interface Site {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  country: string;
  surfaceM2: number | null;
  parkingSpaces: number | null;
  employeesCount: number | null;
  workstationsCount: number | null;
  annualEnergyKwh: number | null;
  buildingYear: number | null;
  buildingLifetime: number;
  materials: SiteMaterial[];
  latestCalculation: Calculation | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteRequest {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  surfaceM2?: number;
  parkingSpaces?: number;
  employeesCount?: number;
  workstationsCount?: number;
  annualEnergyKwh?: number;
  buildingYear?: number;
  buildingLifetime?: number;
  materials?: { materialId: number; quantityKg: number }[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ComparisonItem {
  siteId: number;
  siteName: string;
  city: string | null;
  latestCalculation: Calculation | null;
}

export interface ComparisonResponse {
  sites: ComparisonItem[];
}
