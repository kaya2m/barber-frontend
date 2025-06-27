'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

async function getCustomers() {
  const response = await api.get('/customers');
  return response.data;
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'totalAppointments'>('name');
  
  const { data: customers, loading } = useApi(getCustomers);

  // Mock data for development
  const mockCustomers = [
    {
      id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet.yilmaz@email.com',
      phoneNumber: '0555 123 45 67',
      totalAppointments: 12,
      lastAppointment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      firstName: 'Mehmet',
      lastName: 'Kaya',
      email: 'mehmet.kaya@email.com',
      phoneNumber: '0555 234 56 78',
      totalAppointments: 8,
      lastAppointment: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      firstName: 'Ali',
      lastName: 'Demir',
      email: 'ali.demir@email.com',
      phoneNumber: '0555 345 67 89',
      totalAppointments: 25,
      lastAppointment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const customersData = customers || mockCustomers;

  const filteredCustomers = customersData.filter((customer: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const phone = customer.phoneNumber.toLowerCase();
    const email = customer.email.toLowerCase();
    return fullName.includes(query) || phone.includes(query) || email.includes(query);
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'lastVisit':
        return new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime();
      case 'totalAppointments':
        return b.totalAppointments - a.totalAppointments;
      default:
        return 0;
    }
  });

  const getCustomerCategory = (totalAppointments: number) => {
    if (totalAppointments >= 20) return { label: 'VIP', color: 'warning' };
    if (totalAppointments >= 10) return { label: 'Sadık', color: 'info' };
    if (totalAppointments >= 5) return { label: 'Normal', color: 'success' };
    return { label: 'Yeni', color: 'default' };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Müşteriler</h1>
        <p className="page-subtitle">
          Müşteri listesi ve detayları
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Müşteri ara (ad, telefon, email)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <Button
              variant={sortBy === 'name' ? 'primary' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
            >
              Ad Soy Ad
            </Button>
            <Button
              variant={sortBy === 'lastVisit' ? 'primary' : 'outline'}
              onClick={() => setSortBy('lastVisit')}
              size="sm"
            >
              Son Ziyaret
            </Button>
            <Button
              variant={sortBy === 'totalAppointments' ? 'primary' : 'outline'}
              onClick={() => setSortBy('totalAppointments')}
              size="sm"
            >
              Randevu Sayısı
            </Button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Müşteriler yükleniyor...</div>
            </CardContent>
          </Card>
        ) : sortedCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Müşteri bulunamadı
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Arama kriterlerinize uygun müşteri bulunamadı.'
                  : 'Henüz müşteri bulunmuyor.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedCustomers.map((customer: any) => {
            const category = getCustomerCategory(customer.totalAppointments);
            
            return (
              <Card key={customer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Name & Category */}
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <Badge variant={category.color as any}>
                          {category.label}
                        </Badge>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{customer.phoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span>{customer.email}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4 text-blue-500" />
                          <span>{customer.totalAppointments} randevu</span>
                        </div>
                        <div className="text-gray-600">
                          Son ziyaret: {formatDate(customer.lastAppointment)}
                        </div>
                        <div className="text-gray-600">
                          Üye: {formatDate(customer.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Detaylar
                      </Button>
                      <Button size="sm" variant="outline">
                        <PhoneIcon className="w-4 h-4 mr-1" />
                        Ara
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}