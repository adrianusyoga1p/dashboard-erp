import type { Product } from "./product";

export type StockIn = {
  id: string;
  qty: number | null;
  minimumStock: number | null;
  productId: string;
  updateAt: string;
  createdAt: string;
  product: Product
  admin: {
    name: string;
    id: string;
  }
};

export type StockInPayload = {
  qty: number | null;
  minimumStock: number | null;
  productId: string;
  reason?: string | null;
}
