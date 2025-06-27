'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { CalendarIcon, ClockIcon, UserIcon, ScissorsIcon } from '@heroicons/react/24/outline';
import type { Service, User } from '@/types/auth';

interface AppointmentSummaryProps {
  service?: Service;
  barber?: User;
  appointmentDate?: Date;
  appointmentTime?: string;
  notes?: string;
}

export function AppointmentSummary({ 
  service, 
  barber, 
  appointmentDate, 
  appointmentTime,
  notes 
}: AppointmentSummaryProps) {
  const depositAmount = service ? service.price * 0.2 : 0;
  const fullPayment = service?.requiresFullPayment;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Randevu Özeti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service */}
        {service && (
          <div className="flex items-start space-x-3">
            <ScissorsIcon className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{service.name}</span>
                <Badge variant="default">
                  {service.serviceType === 'Regular' ? 'Normal' : 'VIP'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">{service.description}</div>
              <div className="text-sm text-gray-500">{service.duration} dakika</div>
            </div>
          </div>
        )}

        {/* Barber */}
        {barber && (
          <div className="flex items-center space-x-3">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-medium">
                {barber.firstName} {barber.lastName}
              </span>
              <div className="text-sm text-gray-500">
                {barber.role === 'SuperAdmin' ? 'Patron' : 'Berber'}
              </div>
            </div>
          </div>
        )}

        {/* Date & Time */}
        {appointmentDate && appointmentTime && (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formatDate(appointmentDate)}</span>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{appointmentTime}</span>
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-1">Notlar:</div>
            <div className="text-sm text-gray-600">{notes}</div>
          </div>
        )}

        {/* Payment Info */}
        {service && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Toplam Tutar:</span>
              <span className="font-bold">{formatCurrency(service.price)}</span>
            </div>
            
            {fullPayment ? (
              <div className="flex justify-between text-orange-600">
                <span>Ödenecek Tutar:</span>
                <span className="font-bold">{formatCurrency(service.price)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-primary-600">
                  <span>Kapora (%20):</span>
                  <span className="font-bold">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Kalan Tutar:</span>
                  <span>{formatCurrency(service.price - depositAmount)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}