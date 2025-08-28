import type { Unit } from "./unit";

export type Product = {
  id: string;
  name: string | null;
  brandName: string | null;
  productCategoryId: string | null;
  price: number;
  code: string | null;
  productSku: string | null;
  description: string | null;
  active: boolean;
  updateAt: string;
  createdAt: string;
  productCategory: ProductCategory | null;
  currentQty: number;
  minimumStock: number;
  unitInfo: {
    inputQty: number;
    factor: number;
    qtySmallestUnit: number;
    isManual: boolean;
    baseUnit: Unit;
    smallestUnit: Unit;
  } | null;
  baseUnitId: string | null;
  baseUnit: Unit | null;
};

export type ProductPayload = {
  name: string | null;
  brandName: string | null;
  code: string | null;
  description: string | null;
  baseUnitId?: string | null;
  productCategoryId: string | null;
  price: number | null;
  productSku: string | null;
  active: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
  code: string;
  active?: boolean;
  updatedAt: string;
  createdAt: string;
}
