export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  salonId?: string;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = 'Customer' | 'Barber' | 'SuperAdmin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresAt?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // dakika
  serviceType: ServiceType;
  isActive: boolean;
  requiresFullPayment: boolean;
}

export type ServiceType = 'Regular' | 'VIPRoom' | 'VIPCar';

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  salonId: string;
  serviceId: string;
  appointmentDate: string;
  status: AppointmentStatus;
  totalAmount: number;
  depositAmount: number;
  notes?: string;
  createdAt: string;
  
  // Relations
  customer?: User;
  barber?: User;
  service?: Service;
  payment?: Payment;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface CreateAppointmentRequest {
  serviceId: string;
  barberId: string;
  appointmentDate: string;
  notes?: string;
}

// src/types/payment.ts
export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  processedAt?: string;
}

export type PaymentType = 'Deposit' | 'Full' | 'Refund';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface PaymentSimulation {
  appointmentId: string;
  amount: number;
  paymentType: PaymentType;
  success: boolean;
  transactionId: string;
}

// src/types/availability.ts
export interface BarberAvailability {
  id: string;
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  barberId: string;
}

// src/types/salon.ts
export interface Salon {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// src/types/dashboard.ts
export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface RecentActivity {
  id: string;
  type: 'appointment_created' | 'appointment_confirmed' | 'appointment_cancelled' | 'payment_completed';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// src/types/form.ts
export interface AppointmentFormData {
  step: number;
  serviceId?: string;
  barberId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}