import type { ApiResponse, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Unit } from "@/types/unit";

export const apiGetListUnit = (params: unknown) => {
  return apiClient<ApiResponse<WithMeta<Unit[]>>>({
    method: "GET",
    url: "/api/v1/unit",
    params,
  });
};
