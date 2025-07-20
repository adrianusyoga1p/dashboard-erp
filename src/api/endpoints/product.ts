import type { ApiResponse, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Product } from "@/types/product";

export const apiCreateProduct = (data: unknown) => {
  return apiClient<ApiResponse<Product>>({
    method: "POST",
    url: "/api/v1/product",
    data,
  });
};

export const apiGetListProduct = (params?: unknown) => {
  return apiClient<ApiResponse<WithMeta<Product[]>>>({
    method: "GET",
    url: "/api/v1/product",
    params,
  });
};

export const apiGeDetailProduct = (id: string) => {
  return apiClient<ApiResponse<Product>>({
    method: "GET",
    url: "/api/v1/product/" + id,
  });
};

export const apiUpdateProduct = (id: string, data: unknown) => {
  return apiClient<ApiResponse<Product>>({
    method: "PUT",
    url: "/api/v1/product/" + id,
    data,
  });
};

export const apiDeleteProduct = (id: string) => {
  return apiClient<ApiResponse<Product>>({
    method: "DELETE",
    url: "/api/v1/product/" + id,
  }); 
}