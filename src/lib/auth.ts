'use client';

import { api } from './api';
import { API_ENDPOINTS } from './constants';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        debugger
        localStorage.setItem('auth_token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        return response.data;
      }
      
      throw new Error(response.message || 'Giriş başarısız');
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Giriş sırasında bir hata oluştu');
    }
  }

  async register(userData: RegisterRequest): Promise<void> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Kayıt başarısız');
      }
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Refresh token bulunamadı');
      }

      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      });

      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        return response.data;
      }

      throw new Error('Token yenileme başarısız');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout(); // Refresh başarısızsa logout yap
      return null;
    }
  }

  async getCurrentUser(): Promise<unknown> {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      
      throw new Error('Kullanıcı bilgileri alınamadı');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });

      if (!response.success) {
        throw new Error(response.message || 'Şifre değiştirme başarısız');
      }
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Şifre değiştirme sırasında bir hata oluştu');
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  getUser(): unknown | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = AuthService.getInstance();