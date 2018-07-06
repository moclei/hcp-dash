export interface SpeedyApp {
  timestamp: Date;
  email: string;
  propertyName?: string;
  preparerName?: string;
  customerName?: string;
  unit?: Unit;
  rent?: number;
  income?: number;
  employment?: boolean;
  rental?: boolean;
  legal?: boolean;
  isAppeal?: boolean;
  fullDeposit?: boolean;
  approved?: boolean;
}

export interface Unit {
  unitName: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  floorplan: string;
  streetAddress: string;
  legalName: string;
  businessName: string;
  county: string;
}
