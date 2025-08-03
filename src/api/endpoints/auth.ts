import type { ApiResponse } from "@/types/common";
import apiClient from "../client";
import type { AuthLogin } from "@/types/auth";
import type { User } from "@/types/user";

export const apiAuthLogin = (data: { email: string; password: string }) => {
  return apiClient<ApiResponse<AuthLogin>>({
    method: "POST",
    url: "api/v1/auth/login",
    data,
  });
};

export const apiAuthGetMe = () => {
  return apiClient<ApiResponse<User>>({
    method: "GET",
    url: "/api/v1/auth/me",
  });
};
