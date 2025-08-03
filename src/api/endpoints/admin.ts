import type { Admin, AdminPayload } from "@/types/admin";
import apiClient from "../client";
import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";

export const apiCreateAdmin = (data: AdminPayload) => {
  return apiClient<ApiResponse<Admin>>({
    method: "POST",
    url: "/api/v1/admin",
    data,
  });
};

export const apiGetListAdmin = (params: BaseParam<Admin>) => {
  return apiClient<ApiResponse<WithMeta<Admin[]>>>({
    method: "GET",
    url: "/api/v1/admin",
    params,
  });
};

export const apiGetDetailAdmin = (id: string) => {
  return apiClient<ApiResponse<Admin>>({
    method: "GET",
    url: `/api/v1/admin/${id}`,
  });
};

export const apiUpdateAdmin = (
  id: string,
  data: AdminPayload & {
    fullName: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    address: string | null;
  }
) => {
  return apiClient<ApiResponse<Admin>>({
    method: "PUT",
    url: `/api/v1/admin/${id}`,
    data,
  });
};

export const apiDeleteAdmin = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/admin/${id}`,
  });
};
