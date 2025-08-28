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

export type AnalyticTopProduct = {
  productId: string;
  qtyOrder: number;
  productName: string;
  productBrandName: string;
  productCategoryName: string;
};

export type AnalyticDailyRevenue = {
  date: "2025-08-23";
  revenue: 2760000;
  product: AnalyticProduct[];
};

type AnalyticProduct = {
  id: string;
  name: string;
  brandName: string;
  productSku?: string;
  productCategoryName?: string;
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
} & AnalyticProduct;

type ProductOut = {
  stockOutDate: string;
} & AnalyticProduct;

type ProductReturn = {
  stockReturnDate: string;
} & AnalyticProduct;
