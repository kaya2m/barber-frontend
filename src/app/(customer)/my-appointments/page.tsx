'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/use-api';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';

const mockAppointments = [
  {
    id: '1',
    service: { name: 'Saç + Sakal', duration: 45 },
    barber: { firstName: 'Mehmet', lastName: 'Kılıç' },
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'Confirmed',
    totalAmount: 80,
    notes: 'Sakalı çok kısa olmasın'
  },
  {
    id: '2',
    service: { name: 'Klasik Kesim', duration: 30 },
    barber: { firstName: 'Kemal', lastName: 'Arslan' },
    appointmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    totalAmount: 50,
    notes: null
  },
  {
    id: '3',
    service: { name: 'VIP Paket', duration: 60 },
    barber: { firstName: 'Mehmet', lastName: 'Kılıç' },
    appointmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    totalAmount: 150,
    notes: null
  }
];

export default function MyAppointmentsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

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

  const filteredAppointments = mockAppointments.filter((appointment) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['Pending', 'Confirmed'].includes(appointment.status);
    if (filter === 'completed') return appointment.status === 'Completed';
    if (filter === 'cancelled') return appointment.status === 'Cancelled';
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Randevularım</h1>
            <p className="page-subtitle">
              Geçmiş ve gelecek randevularınızı görüntüleyin
            </p>
          </div>
          <Link href="/appointment">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Yeni Randevu
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Tümü
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="sm"
          >
            Yaklaşan
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilter('completed')}
            size="sm"
          >
            Tamamlanan
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'primary' : 'outline'}
            onClick={() => setFilter('cancelled')}
            size="sm"
          >
            İptal Edilen
          </Button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Randevu bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Henüz randevu bulunmuyor.' 
                  : `${filter === 'upcoming' ? 'Yaklaşan' : filter === 'completed' ? 'Tamamlanan' : 'İptal edilen'} randevu bulunmuyor.`}
              </p>
              <Link href="/appointment">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  İlk Randevunu Al
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
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

                    {/* Barber Info */}
                    <div className="flex items-center space-x-1 text-gray-600">
                      <UserIcon className="w-4 h-4" />
                      <span>
                        {appointment.barber.firstName} {appointment.barber.lastName}
                      </span>
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
                    <div className="text-xl font-bold text-blue-600">
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
                  <div className="ml-6 flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      Detaylar
                    </Button>
                    {appointment.status === 'Confirmed' && (
                      <Button size="sm" variant="danger">
                        İptal Et
                      </Button>
                    )}
                    {appointment.status === 'Completed' && (
                      <Button size="sm" variant="outline">
                        Tekrar Randevu Al
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}