import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

type APIResolved<T> = (response: T) => void;
type APIRejected = (error: AxiosError) => void;
const baseURL = import.meta.env.VITE_API_URL;

const apiClient = <T>(payload: AxiosRequestConfig) => {
  return new Promise((resolve: APIResolved<T>, reject: APIRejected) => {
    const baseClient = axios.create({
      baseURL,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    baseClient.interceptors.request.use((config) => {
      const { token, businessId } = useAuthStore.getState();

      if (token) config.headers.Authorization = `Bearer ${token}`;

      if (businessId) {
        config.params = {
          ...config.params,
          businessId,
        };
      }

      return config;
    });

    baseClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status == 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );

    baseClient<T>(payload)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError<T>) => {
        if (error.response) {
          resolve(error.response.data);
        } else {
          reject(error);
        }
      });
  });
};

export default apiClient;
