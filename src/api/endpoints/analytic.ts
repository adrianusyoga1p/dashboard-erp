import type { ApiResponse } from "@/types/common"
import apiClient from "../client"
import type { AnalyticStockIn, AnalyticStockOut, AnalyticStockReturn } from "@/types/analytic"

export const apiAnalyticStockIn = () => {
  return apiClient<ApiResponse<AnalyticStockIn>>({
    method: 'GET',
    url: 'api/v1/analytic/stock-in'
  })
}

export const apiAnalyticStockOut = () => {
  return apiClient<ApiResponse<AnalyticStockOut>>({
    method: 'GET',
    url: 'api/v1/analytic/stock-out'
  })
}

export const apiAnalyticStockReturn = () => {
  return apiClient<ApiResponse<AnalyticStockReturn>>({
    method: 'GET',
    url: 'api/v1/analytic/stock-return'
  })
}