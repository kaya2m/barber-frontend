import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi girin'),
  phoneNumber: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Hizmet seçimi zorunludur'),
  barberId: z.string().min(1, 'Berber seçimi zorunludur'),
  appointmentDate: z.string().min(1, 'Tarih seçimi zorunludur'),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi girin'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
});