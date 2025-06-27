export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface Barber {
  firstName: string;
  lastName: string;
}

export interface Service {
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface Payment {
  status: string;
  amount: number;
  paymentType: string;
  transactionId: string;
}

export interface Appointment {
  id: string;
  customer: Customer;
  barber: Barber;
  service: Service;
  appointmentDate: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  totalAmount: number;
  depositAmount: number;
  notes?: string;
  createdAt: string;
  payment?: Payment;
}