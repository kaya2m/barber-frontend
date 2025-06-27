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
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const authResponse = await authService.login(credentials);
          set({ 
            user: authResponse.user, 
            token: authResponse.token, 
            isLoading: false 
          });
          return authResponse;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          await authService.register(userData);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
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
          set({ user: null, token: null, isLoading: false });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.getCurrentUser();
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ user: null, token: null, isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, token, isLoading: false, isInitialized: true });
        } catch (error) {
          console.error('Auth check failed:', error);
          await authService.logout();
          set({ user: null, token: null, isLoading: false, isInitialized: true });
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;
        const storedUser = authService.getUser();
        const storedToken = authService.getToken();
        if (storedUser && storedToken) {
          set({ user: storedUser, token: storedToken });
          get().checkAuth();
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);
