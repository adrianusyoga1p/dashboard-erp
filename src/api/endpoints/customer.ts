import apiClient from "../client";
import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";
import type { Customer, CustomerPayload } from "@/types/customer";

export const apiCreateCustomer = (data: CustomerPayload) => {
  return apiClient<ApiResponse<Customer>>({
    method: "POST",
    url: "/api/v1/customer",
    data,
  });
};

export const apiGetListCustomer = (params: BaseParam<Customer>) => {
  return apiClient<ApiResponse<WithMeta<Customer[]>>>({
    method: "GET",
    url: "/api/v1/customer",
    params,
  });
};

export const apiGetDetailCustomer = (id: string) => {
  return apiClient<ApiResponse<Customer>>({
    method: "GET",
    url: `/api/v1/customer/${id}`,
  });
};

export const apiUpdateCustomer = (id: string, data: CustomerPayload) => {
  return apiClient<ApiResponse<Customer>>({
    method: "PUT",
    url: `/api/v1/customer/${id}`,
    data,
  });
};

export const apiDeleteCustomer = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/customer/${id}`,
  });
};
