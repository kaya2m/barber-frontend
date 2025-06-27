'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Appointment } from '@/types/auth';



async function getBarberAppointments(): Promise<Appointment[]> {
  const response = await api.get('/appointments/barber');
  return response.data  as Appointment[];
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'cancel';
    appointmentId: string;
  }>({ isOpen: false, type: 'confirm', appointmentId: '' });

  const { data: appointments, loading, execute: refetch } = useApi<Appointment[]>(getBarberAppointments);

  const mockAppointments: any[] = [
    {
      id: '1',
      customerId: '101',
      barberId: '201',
      salonId: '301',
      serviceId: '401',
      customer: { firstName: 'Ahmet', lastName: 'Yılmaz', phoneNumber: '0555 123 45 67' },
      service: { name: 'Saç Kesimi', duration: 30 },
      appointmentDate: new Date().toISOString(),
      status: 'Pending',
      totalAmount: 50,
      notes: 'Kısa kesim istiyorum'
    },
    {
      id: '2',
      customerId: '102',
      barberId: '202',
      salonId: '302',
      serviceId: '402',
      customer: { firstName: 'Mehmet', lastName: 'Kaya', phoneNumber: '0555 234 56 78' },
      service: { name: 'Saç + Sakal', duration: 45 },
      appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'Confirmed',
      totalAmount: 80,
      notes: null
    },
    {
      id: '3',
      customerId: '103',
      barberId: '203',
      salonId: '303',
      serviceId: '403',
      customer: { firstName: 'Ali', lastName: 'Demir', phoneNumber: '0555 345 67 89' },
      service: { name: 'VIP Paket', duration: 60 },
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending',
      totalAmount: 150,
      notes: 'VIP oda tercih ediyorum'
    }
  ];

  const filteredAppointments = ( mockAppointments).filter((appointment: any) => {
    if (filter === 'pending' && appointment.status !== 'Pending') return false;
    if (filter === 'confirmed' && appointment.status !== 'Confirmed') return false;
    if (filter === 'today') {
      const today = new Date().toDateString();
      const appointmentDate = new Date(appointment.appointmentDate).toDateString();
      if (today !== appointmentDate) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = `${appointment.customer.firstName} ${appointment.customer.lastName}`.toLowerCase();
      const serviceName = appointment.service.name.toLowerCase();
      if (!customerName.includes(query) && !serviceName.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: 'Confirmed' });
      toast.success('Randevu onaylandı');
      refetch();
    } catch (error) {
      toast.error('Randevu onaylanırken hata oluştu');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: 'Cancelled' });
      toast.success('Randevu iptal edildi');
      refetch();
    } catch (error) {
      toast.error('Randevu iptal edilirken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': return 'Bekliyor';
      case 'Confirmed': return 'Onaylandı';
      case 'Completed': return 'Tamamlandı';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Randevular</h1>
        <p className="page-subtitle">
          Randevularınızı görüntüleyin ve yönetin
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* View Toggle & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
              size="sm"
            >
              Liste
            </Button>
            <Button
              variant={view === 'calendar' ? 'primary' : 'outline'}
              onClick={() => setView('calendar')}
              size="sm"
            >
              Takvim
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Tümü
            </Button>
            <Button
              variant={filter === 'today' ? 'primary' : 'outline'}
              onClick={() => setFilter('today')}
              size="sm"
            >
              Bugün
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              Bekleyenler
            </Button>
            <Button
              variant={filter === 'confirmed' ? 'primary' : 'outline'}
              onClick={() => setFilter('confirmed')}
              size="sm"
            >
              Onaylananlar
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Müşteri adı veya hizmet ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {view === 'calendar' ? (
        <CalendarView
          appointments={filteredAppointments}
          onAppointmentClick={setSelectedAppointment}
        />
      ) : (
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-pulse">Randevular yükleniyor...</div>
              </CardContent>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Randevu bulunamadı
                </h3>
                <p className="text-gray-600">
                  {filter === 'today' 
                    ? 'Bugün için randevu bulunmuyor.' 
                    : searchQuery
                    ? 'Arama kriterlerinize uygun randevu bulunamadı.'
                    : 'Henüz randevu bulunmuyor.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment: any) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Service & Status */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{appointment.service.name}</h3>
                        <Badge variant={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>
                            {appointment.customer.firstName} {appointment.customer.lastName}
                          </span>
                        </div>
                        <span>{appointment.customer.phoneNumber}</span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatTime(appointment.appointmentDate)}</span>
                        </div>
                        <span>({appointment.service.duration} dk)</span>
                      </div>

                      {/* Amount */}
                      <div className="text-xl font-bold text-primary-600">
                        {formatCurrency(appointment.totalAmount)}
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>Not:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {appointment.status === 'Pending' && (
                      <div className="ml-6 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              type: 'confirm',
                              appointmentId: appointment.id
                            });
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              type: 'cancel',
                              appointmentId: appointment.id
                            });
                          }}
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          if (confirmDialog.type === 'confirm') {
            handleConfirmAppointment(confirmDialog.appointmentId);
          } else {
            handleCancelAppointment(confirmDialog.appointmentId);
          }
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }}
        title={confirmDialog.type === 'confirm' ? 'Randevu Onayla' : 'Randevu Reddet'}
        message={
          confirmDialog.type === 'confirm'
            ? 'Bu randevuyu onaylamak istediğinizden emin misiniz?'
            : 'Bu randevuyu reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
        }
        confirmText={confirmDialog.type === 'confirm' ? 'Onayla' : 'Reddet'}
        variant={confirmDialog.type === 'confirm' ? 'info' : 'danger'}
      />
    </div>
  );
}
