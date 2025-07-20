import type { ApiResponse } from "@/types/common";
import apiClient from "../client";
import type { AuthLogin } from "@/types/auth";

export const apiAuthLogin = (data: { email: string; password: string }) => {
  return apiClient<ApiResponse<AuthLogin>>({
    method: "POST",
    url: "api/v1/auth/login",
    data,
  });
};
