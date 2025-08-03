import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Access } from "@/types/access";

export const apiGetListAccess = (params: BaseParam<Access>) => {
  return apiClient<ApiResponse<WithMeta<Access[]>>>({
    method: "GET",
    url: "/api/v1/access",
    params,
  });
};
