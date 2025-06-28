'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Type definitions
interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Barber {
  firstName: string;
  lastName: string;
}

interface Service {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface Payment {
  status: string;
  amount: number;
  paymentType: string;
  transactionId: string;
}

interface Appointment {
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

async function getAppointmentDetails(id: string): Promise<Appointment> {
  const response = await api.get(`/appointments/${id}`);
  return response.data as Appointment;
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const { data: appointment, loading } = useApi<Appointment>(() => getAppointmentDetails(appointmentId));

  const mockAppointment: Appointment = {
    id: appointmentId,
    customer: {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet.yilmaz@email.com',
      phoneNumber: '0555 123 45 67'
    },
    barber: {
      firstName: 'Mehmet',
      lastName: 'Kılıç'
    },
    service: {
      name: 'Saç + Sakal',
      description: 'Profesyonel saç kesimi ve sakal tıraşı',
      duration: 45,
      price: 80
    },
    appointmentDate: new Date().toISOString(),
    status: 'Pending',
    totalAmount: 80,
    depositAmount: 16,
    notes: 'Sakalı çok kısa olmasın, saç için orta boy',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    payment: {
      status: 'Completed',
      amount: 16,
      paymentType: 'Deposit',
      transactionId: 'TXN123456789'
    }
  };

  // Ensure we always have a properly typed appointment object
  const appointmentData: Appointment = appointment ?? mockAppointment;

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'Pending': return 'Bekliyor';
      case 'Confirmed': return 'Onaylandı';
      case 'Completed': return 'Tamamlandı';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="page-title">Randevu Detayları</h1>
          <p className="page-subtitle">#{appointmentData.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Randevu Bilgileri</CardTitle>
                <Badge variant={getStatusColor(appointmentData.status)}>
                  {getStatusLabel(appointmentData.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Tarih</div>
                    <div className="text-gray-600">{formatDate(appointmentData.appointmentDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Saat</div>
                    <div className="text-gray-600">
                      {formatTime(appointmentData.appointmentDate)} ({appointmentData.service.duration} dk)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Hizmet</div>
                  <div className="text-gray-900">{appointmentData.service.name}</div>
                  <div className="text-gray-600 text-sm">{appointmentData.service.description}</div>
                </div>
              </div>

              {appointmentData.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">Müşteri Notları</div>
                  <div className="text-gray-700">{appointmentData.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">
                    {appointmentData.customer.firstName} {appointmentData.customer.lastName}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Telefon</div>
                  <div className="text-gray-600">{appointmentData.customer.phoneNumber}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">{appointmentData.customer.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Toplam Tutar</div>
                  <div className="text-2xl font-bold">{formatCurrency(appointmentData.totalAmount)}</div>
                </div>
                
                {appointmentData.payment && (
                  <div>
                    <div className="text-sm text-gray-600">Ödenen Tutar</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(appointmentData.payment.amount)}
                    </div>
                  </div>
                )}
              </div>

              {appointmentData.payment && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ödeme Durumu:</span>
                    <Badge variant="success">Tamamlandı</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödeme Tipi:</span>
                    <span>{appointmentData.payment.paymentType === 'Deposit' ? 'Kapora' : 'Tam Ödeme'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İşlem No:</span>
                    <span className="font-mono text-sm">{appointmentData.payment.transactionId}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointmentData.status === 'Pending' && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Randevuyu Onayla
                  </Button>
                  <Button variant="danger" className="w-full">
                    Randevuyu Reddet
                  </Button>
                </>
              )}
              
              {appointmentData.status === 'Confirmed' && (
                <>
                  <Button className="w-full">
                    Tamamlandı Olarak İşaretle
                  </Button>
                  <Button variant="outline" className="w-full">
                    Randevuyu Düzenle
                  </Button>
                </>
              )}

              <Button variant="outline" className="w-full">
                Müşteriyi Ara
              </Button>
              <Button variant="outline" className="w-full">
                SMS Gönder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Randevu Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Oluşturuldu:</span>
                  <span>{formatDate(appointmentData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span>{getStatusLabel(appointmentData.status)}</span>
                </div>
                {appointmentData.payment && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme:</span>
                    <span>Tamamlandı</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}