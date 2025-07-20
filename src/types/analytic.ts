export type AnalyticStockIn = {
  products: ProductIn[];
  summary: {
    totalProducts: number;
    totalQty: number;
  } & SummaryIn;
};

export type AnalyticStockOut = {
  products: ProductOut[];
  summary: {
    totalProducts: number;
    totalQty: number;
  } & SummaryOut;
};

export type AnalyticStockReturn = {
  products: ProductReturn[];
  summary: {
    totalProducts: number;
    totalQty: number;
  } & SummaryReturn;
};

type Product = {
  id: string;
  name: string;
  brandName: string;
  price: number;
  qtyIn: number;
  reason: string;
};

type SummaryIn = {
  totalStocksIn: number;
};

type SummaryOut = {
  totalStocksOut: number;
};

type SummaryReturn = {
  totalStocksReturn: number;
};

type ProductIn = {
  stockInDate: string;
} & Product;

type ProductOut = {
  stockOutDate: string;
} & Product;

type ProductReturn = {
  stockReturnDate: string;
} & Product;
