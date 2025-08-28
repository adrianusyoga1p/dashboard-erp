export type Unit = {
  id: string;
  name: string;
  code: string;
  unitCategoryId: string;
  unitCategory?: UnitCategory | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UnitPayload = {
  code: string;
  name: string;
  unitCategoryId: string | null;
  description: string | null;
};

export type UnitCategory = {
  id: string;
  name: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
};

export type UnitConversion = {
  id: string;
  name: string;
  businessId: string;
  toUnitId: string;
  baseUnitId: string;
  factor: number;
  createdAt: string;
  updatedAt: string;
  baseUnit: Unit;
  toUnit: Unit;
};

export type UnitConversionPayload = {
  name: string;
  baseUnitId: string;
  toUnitId: string;
  factor: number | null;
};
