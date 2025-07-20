import type { ApiResponse, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Category } from "@/types/category";

export const apiGetListCategory = (params: unknown) => {
  return apiClient<ApiResponse<WithMeta<Category[]>>>({
    method: "GET",
    url: "/api/v1/category",
    params,
  });
};
