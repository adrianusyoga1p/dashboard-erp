import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";
import apiClient from "../client";
import type { Category } from "@/types/category";

export const apiCreateCategory = (data: {
  name: string;
  code: string;
  active?: boolean;
}) => {
  return apiClient<ApiResponse<Category>>({
    method: "POST",
    url: "/api/v1/category",
    data,
  });
};

export const apiGetListCategory = (params: BaseParam<Category>) => {
  return apiClient<ApiResponse<WithMeta<Category[]>>>({
    method: "GET",
    url: "/api/v1/category",
    params,
  });
};

export const apiGetDetailCategory = (id: string) => {
  return apiClient<ApiResponse<Category>>({
    method: "GET",
    url: `/api/v1/category/${id}`,
  });
};

export const apiUpdateCategory = (
  id: string,
  data: { name: string; code: string; active?: boolean }
) => {
  return apiClient<ApiResponse<Category>>({
    method: "PUT",
    url: `/api/v1/category/${id}`,
    data,
  });
};

export const apiDeleteCategory = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/category/${id}`,
  });
};
