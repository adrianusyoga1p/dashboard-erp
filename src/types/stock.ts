import type { Product } from "./product";

type Stock = {
  id: string;
  businessId: string;
  productId: string;
  supplierId: string | null;
  updatedAt: string;
  createdAt: string;
};

type CreatedBy = {
  id: string;
  name: string;
  divisionId: string | null;
  userId: string;
  roleId: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
};

export type Stocks = {
  id: string;
  stockId: string;
  businessId: string;
  type: string;
  qty: number;
  reason: string;
  createdAt: string;
  stock: Stock;
  product: Product & {
    currentQty: number;
  };
  createdBy: CreatedBy;
};

export type StocksPayload = {
  qty: number | null;
  minimumStock: number | null;
  productId: string;
  reason?: string | null;
};

export type StockSales = {
  id: string;
  salesId: string;
  salesName: string;
  totalStock: number;
  products: {
    id: string;
    name: string;
    brandName: string;
    productSku: string;
    qtyStock: number;
  }[];
};
