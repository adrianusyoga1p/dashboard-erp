import type { Category } from "./category";
import type { Unit } from "./unit";

export type Product = {
  id: string;
  name: string;
  currentQty: number;
  price: number;
  updateAt: string;
  createdAt: string;
  productSku: string;
  code: string;
  categoryId: string;
  status: 'pending' | 'active' | 'approved' | 'rejected';
  category: Category;
  unitInfo: {
    inputQty: number;
    factor: number;
    qtySmallestUnit: number;
    isManual: boolean;
    baseUnit: Unit;
    smallestUnit: Unit;
  };
};
