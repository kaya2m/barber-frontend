'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/auth';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const authResponse = await authService.login(credentials);
          set({ 
            user: authResponse.user, 
            token: authResponse.accessToken, 
            isLoading: false,
            error: null
          });
          return authResponse;
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Giriş başarısız',
            user: null,
            token: null 
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(userData);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Kayıt başarısız' 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isLoading: false,
            error: null,
            isInitialized: true
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.getCurrentUser();
          set({ user: updatedUser, isLoading: false, error: null });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Profil güncellenemedi' 
          });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Şifre değiştirilemedi' 
          });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ user: null, token: null, isInitialized: true, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, token, isLoading: false, isInitialized: true, error: null });
        } catch (error) {
          console.error('Auth check failed:', error);
          await authService.logout();
          set({ 
            user: null, 
            token: null, 
            isLoading: false, 
            isInitialized: true,
            error: null
          });
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;
        
        // Client-side only initialization
        if (typeof window === 'undefined') {
          set({ isInitialized: true });
          return;
        }

        const storedToken = authService.getToken();
        const storedUser = authService.getUser();
        
        if (storedUser && storedToken) {
          set({ 
            user: storedUser, 
            token: storedToken, 
            isInitialized: false // Will be set to true after checkAuth
          });
          await get().checkAuth();
        } else {
          set({ isInitialized: true, isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
      skipHydration: true,
    }
  )
);