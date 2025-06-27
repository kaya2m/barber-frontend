'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/outline';
import type { User } from '@/types/auth';

interface BarberSelectorProps {
  barbers: User[];
  selectedBarberId?: string;
  onBarberSelect: (barber: User) => void;
  serviceType?: string;
}

export function BarberSelector({ barbers, selectedBarberId, onBarberSelect, serviceType }: BarberSelectorProps) {
  const availableBarbers = serviceType === 'VIPRoom' || serviceType === 'VIPCar' 
    ? barbers.filter(b => b.role === 'SuperAdmin')
    : barbers.filter(b => b.role === 'Barber' || b.role === 'SuperAdmin');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableBarbers.map((barber) => (
          <Card
            key={barber.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg',
              selectedBarberId === barber.id && 'ring-2 ring-primary-500 shadow-lg'
            )}
            onClick={() => onBarberSelect(barber)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {barber.firstName} {barber.lastName}
                  </h3>
                  <Badge variant={barber.role === 'SuperAdmin' ? 'warning' : 'default'}>
                    {barber.role === 'SuperAdmin' ? 'Patron' : 'Berber'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableBarbers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Seçilen hizmet için müsait berber bulunmuyor.
        </div>
      )}
    </div>
  );
}