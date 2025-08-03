import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { User } from "@/types/user";

export const apiGetListUser = (params: BaseParam<User>) => {
  return apiClient<ApiResponse<WithMeta<User[]>>>({
    method: "GET",
    url: "/api/v1/user",
    params,
  });
};

export const apiGetDetailUser = (id: string) => {
  return apiClient<ApiResponse<User>>({
    method: "GET",
    url: "/api/v1/user/" + id,
  });
};
