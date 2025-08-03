import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";
import apiClient from "../client";
import type { Product, ProductPayload } from "@/types/product";

export const apiCreateProduct = (data: ProductPayload) => {
  return apiClient<ApiResponse<Product>>({
    method: "POST",
    url: "/api/v1/product",
    data,
  });
};

export const apiGetListProduct = (params?: BaseParam<Product>) => {
  return apiClient<ApiResponse<WithMeta<Product[]>>>({
    method: "GET",
    url: "/api/v1/product",
    params,
  });
};

export const apiGeDetailProduct = (id: string) => {
  return apiClient<ApiResponse<Product>>({
    method: "GET",
    url: `/api/v1/product/${id}`,
  });
};

export const apiUpdateProduct = (id: string, data: ProductPayload) => {
  return apiClient<ApiResponse<Product>>({
    method: "PUT",
    url: `/api/v1/product/${id}`,
    data,
  });
};

export const apiDeleteProduct = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/product/${id}`,
  });
};
