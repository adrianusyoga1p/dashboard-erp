import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";
import apiClient from "../client";
import type { ProductCategory } from "@/types/product";
import type { UnitCategory } from "@/types/unit";

// Product
export const apiCreateProductCategory = (data: {
  name: string;
  code: string;
  active?: boolean;
}) => {
  return apiClient<ApiResponse<ProductCategory>>({
    method: "POST",
    url: "/api/v1/category",
    data,
  });
};

export const apiGetListProductCategory = (
  params: BaseParam<ProductCategory>
) => {
  return apiClient<ApiResponse<WithMeta<ProductCategory[]>>>({
    method: "GET",
    url: "/api/v1/category",
    params,
  });
};

export const apiGetDetailProductCategory = (id: string) => {
  return apiClient<ApiResponse<ProductCategory>>({
    method: "GET",
    url: `/api/v1/category/${id}`,
  });
};

export const apiUpdateProductCategory = (
  id: string,
  data: { name: string; code: string; active?: boolean }
) => {
  return apiClient<ApiResponse<ProductCategory>>({
    method: "PUT",
    url: `/api/v1/category/${id}`,
    data,
  });
};

export const apiDeleteProductCategory = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/category/${id}`,
  });
};

// Unit
export const apiCreateUnitCategory = (data: { name: string }) => {
  return apiClient<ApiResponse<UnitCategory>>({
    method: "POST",
    url: "/api/v1/unit-category",
    data,
  });
};

export const apiGetListUnitCategory = (params: BaseParam<UnitCategory>) => {
  return apiClient<ApiResponse<WithMeta<UnitCategory[]>>>({
    method: "GET",
    url: "/api/v1/unit-category",
    params,
  });
};

export const apiGetDetailUnitCategory = (id: string) => {
  return apiClient<ApiResponse<UnitCategory>>({
    method: "GET",
    url: "/api/v1/unit-category/" + id,
  });
};

export const apiUpdateUnitCategory = (id: string, data: { name: string }) => {
  return apiClient<ApiResponse<UnitCategory>>({
    method: "PUT",
    url: "/api/v1/unit-category/" + id,
    data,
  });
};

export const apiDeleteUnitCategory = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: "/api/v1/unit-category/" + id,
  });
};
