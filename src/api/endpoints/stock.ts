import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Stocks, StocksPayload, StockSales } from "@/types/stock";

export const apiCreateStockIn = (data: StocksPayload) => {
  return apiClient<ApiResponse<Stocks>>({
    method: "POST",
    url: "/api/v1/stock/in",
    data,
  });
};

export const apiGetListStockIn = (params?: BaseParam<Stocks>) => {
  return apiClient<ApiResponse<WithMeta<Stocks[]>>>({
    method: "GET",
    url: "/api/v1/stock/in",
    params,
  });
};

export const apiCreateStockOut = (
  data: Omit<StocksPayload, "minimumStock">
) => {
  return apiClient<ApiResponse<Stocks>>({
    method: "POST",
    url: "/api/v1/stock/out",
    data,
  });
};

export const apiGetListStockOut = (params: BaseParam<Stocks>) => {
  return apiClient<ApiResponse<WithMeta<Stocks[]>>>({
    method: "GET",
    url: "/api/v1/stock/out",
    params,
  });
};

export const apiCreateStockReturn = (
  data: Omit<StocksPayload, "minimumStock">
) => {
  return apiClient<ApiResponse<Stocks>>({
    method: "POST",
    url: "/api/v1/stock/return",
    data,
  });
};

export const apiGetListStockReturn = (params: BaseParam<Stocks>) => {
  return apiClient<ApiResponse<WithMeta<Stocks[]>>>({
    method: "GET",
    url: "/api/v1/stock/return",
    params,
  });
};

export const apiGetListStockSales = (params?: BaseParam<StockSales>) => {
  return apiClient<ApiResponse<WithMeta<StockSales[]>>>({
    method: "GET",
    url: "/api/v1/stock/sales",
    params,
  });
};

export const apiGetDetailStockSales = (salesId: string) => {
  return apiClient<ApiResponse<StockSales>>({
    method: "GET",
    url: "/api/v1/stock/sales/" + salesId,
  });
};
