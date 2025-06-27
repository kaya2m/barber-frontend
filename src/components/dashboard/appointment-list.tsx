'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { Appointment } from '@/types/auth';

interface AppointmentListProps {
  appointments: Appointment[];
  title: string;
  onAppointmentClick?: (appointment: Appointment) => void;
  showActions?: boolean;
}

export function AppointmentList({ 
  appointments, 
  title, 
  onAppointmentClick,
  showActions = false 
}: AppointmentListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Bekliyor';
      case 'Confirmed':
        return 'Onaylandı';
      case 'Completed':
        return 'Tamamlandı';
      case 'Cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz randevu bulunmuyor.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Service & Status */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{appointment.service?.name}</h3>
                      <Badge variant={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>

                    {/* Customer/Barber Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>
                          {appointment.customer ? 
                            `${appointment.customer.firstName} ${appointment.customer.lastName}` :
                            `${appointment.barber?.firstName} ${appointment.barber?.lastName}`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTime(appointment.appointmentDate)}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-lg font-semibold text-primary-600">
                      {formatCurrency(appointment.totalAmount)}
                    </div>
                  </div>

                  {/* Actions */}
                  {showActions && appointment.status === 'Pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        Düzenle
                      </Button>
                      <Button size="sm" variant="primary">
                        Onayla
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}