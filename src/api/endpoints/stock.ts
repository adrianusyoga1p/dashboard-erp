import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { StockIn, StockInPayload } from "@/types/stock";

export const apiCreateStockIn = (data: StockInPayload) => {
  return apiClient<ApiResponse<StockIn>>({
    method: "POST",
    url: "/api/v1/stock/in",
    data,
  });
};

export const apiGetListStockIn = (params?: BaseParam<StockIn>) => {
  return apiClient<ApiResponse<WithMeta<StockIn[]>>>({
    method: "GET",
    url: "/api/v1/stock/in",
    params,
  });
};
