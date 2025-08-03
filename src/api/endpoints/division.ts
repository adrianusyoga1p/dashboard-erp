import type { Division, DivisionPayload } from "@/types/division";
import apiClient from "../client";
import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";

export const apiCreateDivision = (data: DivisionPayload) => {
  return apiClient<ApiResponse<Division>>({
    method: "POST",
    url: "/api/v1/division",
    data,
  });
};

export const apiGetListDivision = (params: BaseParam<Division>) => {
  return apiClient<ApiResponse<WithMeta<Division[]>>>({
    method: "GET",
    url: "/api/v1/division",
    params,
  });
};

export const apiGetDetailDivision = (id: string) => {
  return apiClient<ApiResponse<Division>>({
    method: "GET",
    url: `/api/v1/division/${id}`,
  });
};

export const apiUpdateDivision = (id: string, data: DivisionPayload) => {
  return apiClient<ApiResponse<Division>>({
    method: "PUT",
    url: `/api/v1/division/${id}`,
    data,
  });
};

export const apiDeleteDivision = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/division/${id}`,
  });
};
