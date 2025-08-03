import type { Sales, SalesPayload } from "@/types/sales";
import apiClient from "../client";
import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";

export const apiCreateSales = (data: SalesPayload) => {
  return apiClient<ApiResponse<Sales>>({
    method: "POST",
    url: "/api/v1/sales",
    data,
  });
};

export const apiGetListSales = (params: BaseParam<Sales>) => {
  return apiClient<ApiResponse<WithMeta<Sales[]>>>({
    method: "GET",
    url: "/api/v1/sales",
    params,
  });
};

export const apiGetDetailSales = (id: string) => {
  return apiClient<ApiResponse<Sales>>({
    method: "GET",
    url: `/api/v1/sales/${id}`,
  });
};

export const apiUpdateSales = (id: string, data: SalesPayload) => {
  return apiClient<ApiResponse<Sales>>({
    method: "PUT",
    url: `/api/v1/sales/${id}`,
    data,
  });
};

export const apiDeleteSales = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/sales/${id}`,
  });
};
