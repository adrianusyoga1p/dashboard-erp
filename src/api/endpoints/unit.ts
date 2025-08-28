import type { ApiResponse, ApiResponseDelete, WithMeta } from "@/types/common";
import apiClient from "../client";
import type { Unit, UnitPayload } from "@/types/unit";
import type { AxiosProgressEvent } from "axios";

export const apiCreateUnit = (data: UnitPayload) => {
  return apiClient<ApiResponse<Unit>>({
    method: "POST",
    url: "/api/v1/unit",
    data,
  });
};

export const apiGetListUnit = (params: unknown) => {
  return apiClient<ApiResponse<WithMeta<Unit[]>>>({
    method: "GET",
    url: "/api/v1/unit",
    params,
  });
};

export const apiGetDetailUnit = (id: string) => {
  return apiClient<ApiResponse<Unit>>({
    method: "GET",
    url: "/api/v1/unit/" + id,
  });
};

export const apiUpdateUnit = (id: string, data: UnitPayload) => {
  return apiClient<ApiResponse<Unit>>({
    method: "PUT",
    url: "/api/v1/unit/" + id,
    data,
  });
};

export const apiDeleteUnit = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: "/api/v1/unit/" + id,
  });
};

export const apiImportUnit = (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return apiClient<
    ApiResponse<
      Unit[] & {
        inserted: number;
      }
    >
  >({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: "/api/v1/unit/import-unit",
    data: { file },
    onUploadProgress,
  });
};