export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    MY: '/appointments/my',
    AVAILABILITY: '/appointments/availability',
  },
  SERVICES: '/services',
  USERS: '/users',
  BARBERS: '/barbers',
  PAYMENTS: '/payments',
  DASHBOARD: '/dashboard',
} as const;
export const USER_ROLES = {
  CUSTOMER: 'Customer',
  BARBER: 'Barber',
  SUPER_ADMIN: 'SuperAdmin',
} as const;

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

export const SERVICE_TYPES = {
  REGULAR: 'Regular',
  VIP_ROOM: 'VIPRoom',
  VIP_CAR: 'VIPCar',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const;

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

