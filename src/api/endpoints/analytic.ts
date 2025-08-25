import type { ApiResponse } from "@/types/common";
import apiClient from "../client";
import type {
  AnalyticDailyRevenue,
  AnalyticStockIn,
  AnalyticStockOut,
  AnalyticStockReturn,
  AnalyticTopProduct,
} from "@/types/analytic";

export const apiAnalyticStockIn = () => {
  return apiClient<ApiResponse<AnalyticStockIn>>({
    method: "GET",
    url: "api/v1/analytic/stock-in",
  });
};

export const apiAnalyticStockOut = () => {
  return apiClient<ApiResponse<AnalyticStockOut>>({
    method: "GET",
    url: "api/v1/analytic/stock-out",
  });
};

export const apiAnalyticStockReturn = () => {
  return apiClient<ApiResponse<AnalyticStockReturn>>({
    method: "GET",
    url: "api/v1/analytic/stock-return",
  });
};

export const apiAnalyticTopProducts = (params?: {
  purchasedAt: string | null;
}) => {
  return apiClient<ApiResponse<AnalyticTopProduct[]>>({
    method: "GET",
    url: "/api/v1/analytic/top-products",
    params,
  });
};

export const apiAnalyticDailyOrders = () => {
  return apiClient<ApiResponse<{ date: string; total: string }[]>>({
    method: "GET",
    url: "/api/v1/analytic/daily-orders",
  });
};

export const apiAnalyticDailyRevenue = () => {
  return apiClient<ApiResponse<AnalyticDailyRevenue[]>>({
    method: "GET",
    url: "/api/v1/analytic/daily-revenue",
  });
};
