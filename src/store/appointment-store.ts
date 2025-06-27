'use client';

import { AppointmentFormData } from '@/types/auth';
import { create } from 'zustand';

interface AppointmentStoreState {
  formData: AppointmentFormData;
  setStep: (step: number) => void;
  setServiceId: (serviceId: string) => void;
  setBarberId: (barberId: string) => void;
  setAppointmentDate: (date: string) => void;
  setAppointmentTime: (time: string) => void;
  setNotes: (notes: string) => void;
  setPaymentMethod: (method: string) => void;
  resetForm: () => void;
  isStepComplete: (step: number) => boolean;
}

const initialFormData: AppointmentFormData = {
  step: 1,
  serviceId: undefined,
  barberId: undefined,
  appointmentDate: undefined,
  appointmentTime: undefined,
  notes: undefined,
  paymentMethod: undefined,
};

export const useAppointmentStore = create<AppointmentStoreState>((set, get) => ({
  formData: initialFormData,

  setStep: (step) => set((state) => ({ 
    formData: { ...state.formData, step } 
  })),

  setServiceId: (serviceId) => set((state) => ({ 
    formData: { ...state.formData, serviceId } 
  })),

  setBarberId: (barberId) => set((state) => ({ 
    formData: { ...state.formData, barberId } 
  })),

  setAppointmentDate: (appointmentDate) => set((state) => ({ 
    formData: { ...state.formData, appointmentDate } 
  })),

  setAppointmentTime: (appointmentTime) => set((state) => ({ 
    formData: { ...state.formData, appointmentTime } 
  })),

  setNotes: (notes) => set((state) => ({ 
    formData: { ...state.formData, notes } 
  })),

  setPaymentMethod: (paymentMethod) => set((state) => ({ 
    formData: { ...state.formData, paymentMethod } 
  })),

  resetForm: () => set({ formData: initialFormData }),

  isStepComplete: (step: number) => {
    const { formData } = get();
    switch (step) {
      case 1:
        return !!formData.serviceId;
      case 2:
        return !!formData.barberId;
      case 3:
        return !!formData.appointmentDate && !!formData.appointmentTime;
      case 4:
        return true; // Summary step
      case 5:
        return !!formData.paymentMethod;
      default:
        return false;
    }
  },
}));
