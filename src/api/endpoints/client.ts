import apiClient from "../client";
import type {
  ApiResponse,
  ApiResponseDelete,
  BaseParam,
  WithMeta,
} from "@/types/common";
import type { Client, ClientPayload } from "@/types/client";

export const apiCreateClient = (data: ClientPayload) => {
  return apiClient<ApiResponse<Client>>({
    method: "POST",
    url: "/api/v1/client",
    data,
  });
};

export const apiGetListClient = (params: BaseParam<Client>) => {
  return apiClient<ApiResponse<WithMeta<Client[]>>>({
    method: "GET",
    url: "/api/v1/client",
    params,
  });
};

export const apiGetDetailClient = (id: string) => {
  return apiClient<ApiResponse<Client>>({
    method: "GET",
    url: `/api/v1/client/${id}`,
  });
};

export const apiUpdateClient = (id: string, data: ClientPayload) => {
  return apiClient<ApiResponse<Client>>({
    method: "PUT",
    url: `/api/v1/client/${id}`,
    data,
  });
};

export const apiDeleteClient = (id: string) => {
  return apiClient<ApiResponseDelete>({
    method: "DELETE",
    url: `/api/v1/client/${id}`,
  });
};
