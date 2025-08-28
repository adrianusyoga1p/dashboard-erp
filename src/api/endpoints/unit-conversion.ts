import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { UnitConversion, UnitConversionPayload } from "@/types/unit";

export const apiCreateUnitConversion = (data: UnitConversionPayload) => {
  return apiClient<ApiResponse<UnitConversion>>({
    method: "POST",
    url: "/api/v1/unit-conversion",
    data,
  });
};

export const apiGetListUnitConversion = (params: BaseParam<UnitConversion>) => {
  return apiClient<ApiResponse<WithMeta<UnitConversion[]>>>({
    method: "GET",
    url: "/api/v1/unit-conversion",
    params,
  });
};
