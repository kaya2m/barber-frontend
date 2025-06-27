'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Service } from '@/types/auth';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId?: string;
  onServiceSelect: (service: Service) => void;
}

export function ServiceSelector({ services, selectedServiceId, onServiceSelect }: ServiceSelectorProps) {
  const [filteredServices, setFilteredServices] = useState(services);
  const [activeFilter, setActiveFilter] = useState<'all' | 'regular' | 'vip'>('all');

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredServices(services);
    } else if (activeFilter === 'regular') {
      setFilteredServices(services.filter(s => s.serviceType === 'Regular'));
    } else if (activeFilter === 'vip') {
      setFilteredServices(services.filter(s => s.serviceType === 'VIPRoom' || s.serviceType === 'VIPCar'));
    }
  }, [services, activeFilter]);

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'default';
      case 'VIPRoom':
        return 'warning';
      case 'VIPCar':
        return 'error';
      default:
        return 'default';
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'Normal Salon';
      case 'VIPRoom':
        return 'VIP Oda';
      case 'VIPCar':
        return 'VIP Araba';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeFilter === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Tümü
        </button>
        <button
          onClick={() => setActiveFilter('regular')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeFilter === 'regular' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Normal Salon
        </button>
        <button
          onClick={() => setActiveFilter('vip')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeFilter === 'vip' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          VIP Hizmetler
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg',
              selectedServiceId === service.id && 'ring-2 ring-primary-500 shadow-lg'
            )}
            onClick={() => onServiceSelect(service)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <Badge variant={getServiceTypeColor(service.serviceType)}>
                  {getServiceTypeLabel(service.serviceType)}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(service.price)}
                </div>
                <div className="text-sm text-gray-500">
                  {service.duration} dakika
                </div>
              </div>

              {service.requiresFullPayment && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  Full ödeme gerekli
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
