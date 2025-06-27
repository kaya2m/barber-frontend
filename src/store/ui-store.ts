'use client';

import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  notifications: Notification[];
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timeout?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  notifications: [],

  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),

  openModal: (content) => set({ 
    isModalOpen: true, 
    modalContent: content 
  }),

  closeModal: () => set({ 
    isModalOpen: false, 
    modalContent: null 
  }),

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto remove after timeout
    if (notification.timeout !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.timeout || 5000);
    }
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
