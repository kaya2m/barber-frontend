import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';
import { ApiError, ApiResponse } from '@/types/auth';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;
        
        if (data && typeof data === 'object') {
          return {
            ...response,
            data: {
              success: data.success !== false, 
              data: data.data || data,
              message: data.message,
            }
          };
        }
        
        return response;
      },
      async (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'Bir hata oluştu',
          status: error.response?.status || 500,
        };

        if (error.response?.data) {
          const data = error.response.data as any;
          
          if (typeof data === 'string') {
            apiError.message = data;
          } else if (data.message) {
            apiError.message = data.message;
          } else if (data.title) {
            apiError.message = data.title;
          }
          
          if (data.errors && typeof data.errors === 'object') {
            apiError.errors = data.errors;
            
            const errorMessages = Object.values(data.errors).flat();
            if (errorMessages.length > 0) {
              apiError.message = Array.isArray(errorMessages[0]) 
                ? errorMessages[0][0] 
                : errorMessages[0] as string;
            }
          }
        }

        if (error.response?.status === 401) {
          try {
            await authService.refreshToken();
            return this.client.request(error.config!);
          } catch (refreshError) {
            authService.logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export const api = new ApiClient();