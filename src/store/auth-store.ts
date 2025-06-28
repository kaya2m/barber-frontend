'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ChangePasswordRequest 
} from '@/types/auth';
import { api } from '@/lib/api';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;

  // Getters
  isAuthenticated: () => boolean;
  hasRole: (role: string | string[]) => boolean;
  can: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Login action
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const { user, accessToken } = response.data;
          
          set({ 
            user, 
            token: accessToken, 
            isLoading: false,
            error: null 
          });
          
          return response.data;
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Giriş başarısız';
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            token: null 
          });
          throw new Error(errorMessage);
        }
      },

      // Register action
      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/register', userData);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Kayıt başarısız';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw new Error(errorMessage);
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        try {
          // API'ye logout request gönder
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // Local state'i temizle
          set({ 
            user: null, 
            token: null, 
            isLoading: false,
            error: null 
          });
        }
      },

      // Update profile action
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put<User>('/auth/profile', userData);
          set({ 
            user: response.data, 
            isLoading: false 
          });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Profil güncellenemedi';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw new Error(errorMessage);
        }
      },

      // Change password action
      changePassword: async (data: ChangePasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
          await api.put('/auth/change-password', data);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Şifre değiştirilemedi';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw new Error(errorMessage);
        }
      },

      // Forgot password action
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'İşlem başarısız';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw new Error(errorMessage);
        }
      },

      // Reset password action
      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/reset-password', { token, newPassword });
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Şifre sıfırlanamadı';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw new Error(errorMessage);
        }
      },

      // Get current user action
      getCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          set({ user: null, isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get<User>('/auth/me');
          set({ 
            user: response.data, 
            isLoading: false, 
            isInitialized: true 
          });
        } catch (error: unknown) {
          console.error('Get user failed:', error);
          set({ 
            user: null, 
            token: null, 
            isLoading: false, 
            isInitialized: true,
            error: 'Kullanıcı bilgileri alınamadı'
          });
        }
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Initialize action
      initialize: async () => {
        const { isInitialized, token } = get();
        if (isInitialized) return;

        if (token) {
          await get().getCurrentUser();
        } else {
          set({ isInitialized: true });
        }
      },

      isAuthenticated: () => {
        const { user, token } = get();
        return !!(user && token);
      },

      hasRole: (role: string | string[]) => {
        const { user } = get();
        if (!user) return false;
        
        if (Array.isArray(role)) {
          return role.includes(String(user.role));
        }
        return user.role === role;
      },

      can: (permission: string) => {
        const { user } = get();
        if (!user) return false;

        // Role-based permissions
        const rolePermissions = {
          'super-admin': ['*'], // Tüm yetkiler
          'admin': [
            'users.read', 'users.write', 'users.delete',
            'appointments.read', 'appointments.write', 'appointments.delete',
            'services.read', 'services.write', 'services.delete',
            'reports.read'
          ],
          'barber': [
            'appointments.read', 'appointments.write',
            'services.read',
            'profile.write'
          ],
          'customer': [
            'appointments.read', 'appointments.write',
            'profile.write'
          ]
        };

        const userPermissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
        
        // Super admin tüm yetkilere sahip
        if (userPermissions.includes('*')) return true;
        
        return userPermissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);