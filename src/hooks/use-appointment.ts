'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Appointment, CreateAppointmentRequest, Service, TimeSlot, User } from '@/types/auth';

export function useAppointment() {
  const [loading, setLoading] = useState(false);

  const createAppointment = async (data: CreateAppointmentRequest): Promise<Appointment> => {
    setLoading(true);
    try {
      const response = await api.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.BASE, data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getMyAppointments = async (): Promise<Appointment[]> => {
    setLoading(true);
    try {
      const response = await api.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.MY);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentById = async (id: string): Promise<Appointment> => {
    setLoading(true);
    try {
      const response = await api.get<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string): Promise<Appointment> => {
    setLoading(true);
    try {
      const response = await api.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/status`, { status });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = async (barberId: string, date: string): Promise<TimeSlot[]> => {
    setLoading(true);
    try {
      const response = await api.get<TimeSlot[]>(`${API_ENDPOINTS.APPOINTMENTS.AVAILABILITY}?barberId=${barberId}&date=${date}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getServices = async (): Promise<Service[]> => {
    setLoading(true);
    try {
      const response = await api.get<Service[]>(API_ENDPOINTS.SERVICES);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getBarbers = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.BARBERS);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    getAvailableSlots,
    getServices,
    getBarbers,
  };
}