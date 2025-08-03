import type { Category } from "./category";
import type { Unit } from "./unit";

export type Product = {
  id: string;
  name: string | null;
  brandName: string | null;
  categoryId: string | null;
  price: number;
  code: string | null;
  productSku: string | null;
  description: string | null;
  active: boolean;
  updateAt: string;
  createdAt: string;
  category: Category | null;
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
};

export type ProductPayload = {
  name: string | null;
  brandName: string | null;
  code: string | null;
  description: string | null;
  categoryId: string | null;
  price: number | null;
  productSku: string | null;
  active: boolean;
};
