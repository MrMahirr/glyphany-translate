import axios, { type AxiosInstance, type AxiosResponse } from "axios";

/**
 * Merkezi HTTP Client.
 * Tüm API çağrıları bu instance üzerinden yapılır.
 * Request interceptor: Auth token ekleme (Bearer JWT)
 * Response interceptor: 401 handling, error normalization
 */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ─── Request Interceptor: Auth Token ─── */
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ─── Response Interceptor: Error Handling ─── */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/* ─── Public API Client ─── */

export const apiClient = {
  get<T>(url: string): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url);
  },

  post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, data);
  },

  patch<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(url, data);
  },

  delete(url: string): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(url);
  },

  postFormData<T>(url: string, formData: FormData): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
