'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

async function getReports(startDate: string, endDate: string) {
  const response = await api.get(`/reports?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  
  const [reportType, setReportType] = useState<'overview' | 'revenue' | 'appointments' | 'customers'>('overview');

  const { data: reportData, loading, execute: refetch } = useApi(
    () => getReports(dateRange.startDate, dateRange.endDate),
    { immediate: true }
  );

  // Mock data for development
  const mockReportData = {
    overview: {
      totalRevenue: 45250,
      totalAppointments: 342,
      totalCustomers: 156,
      averageServiceValue: 132.31,
      completionRate: 94.5,
      popularServices: [
        { name: 'Saç + Sakal', count: 89, percentage: 26 },
        { name: 'Klasik Kesim', count: 76, percentage: 22 },
        { name: 'VIP Paket', count: 45, percentage: 13 }
      ]
    },
    revenue: {
      dailyRevenue: [
        { date: '2024-01-01', amount: 850 },
        { date: '2024-01-02', amount: 920 },
        { date: '2024-01-03', amount: 760 },
        { date: '2024-01-04', amount: 1100 },
        { date: '2024-01-05', amount: 980 }
      ],
      serviceRevenue: [
        { service: 'VIP Paket', revenue: 15750, count: 105 },
        { service: 'Saç + Sakal', revenue: 12480, count: 156 },
        { service: 'Klasik Kesim', revenue: 8900, count: 178 }
      ]
    },
    appointments: {
      statusDistribution: [
        { status: 'Completed', count: 298, percentage: 87 },
        { status: 'Cancelled', count: 28, percentage: 8 },
        { status: 'No Show', count: 16, percentage: 5 }
      ],
      timeDistribution: [
        { hour: '09:00-10:00', count: 45 },
        { hour: '10:00-11:00', count: 52 },
        { hour: '11:00-12:00', count: 48 },
        { hour: '14:00-15:00', count: 38 },
        { hour: '15:00-16:00', count: 41 }
      ]
    },
    customers: {
      newCustomers: 23,
      returningCustomers: 133,
      customerRetentionRate: 85.2,
      topCustomers: [
        { name: 'Ali Demir', appointments: 12, revenue: 960 },
        { name: 'Mehmet Kaya', appointments: 8, revenue: 640 },
        { name: 'Ahmet Yılmaz', appointments: 6, revenue: 480 }
      ]
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleExportReport = () => {
    // // Export functionality would be implemented here
    // toast.success('Rapor dışa aktarılıyor...');
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockReportData.overview.totalRevenue)}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Randevu</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockReportData.overview.totalAppointments}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockReportData.overview.totalCustomers}
                </p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ortalama Hizmet</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(mockReportData.overview.averageServiceValue)}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Services */}
      <Card>
        <CardHeader>
          <CardTitle>Popüler Hizmetler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReportData.overview.popularServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-600">{service.count} randevu</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">%{service.percentage}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hizmet Bazında Gelir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReportData.revenue.serviceRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">{item.service}</div>
                  <div className="text-sm text-gray-600">{item.count} randevu</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Ort: {formatCurrency(item.revenue / item.count)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointmentsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Randevu Durumu Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.appointments.statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{item.status}</span>
                  <div className="flex items-center space-x-2">
                    <span>{item.count}</span>
                    <span className="text-sm text-gray-600">(%{item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saatlere Göre Dağılım</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockReportData.appointments.timeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.hour}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / 52) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCustomersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockReportData.customers.newCustomers}
            </div>
            <div className="text-sm text-gray-600">Yeni Müşteri</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mockReportData.customers.returningCustomers}
            </div>
            <div className="text-sm text-gray-600">Geri Dönen Müşteri</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              %{mockReportData.customers.customerRetentionRate}
            </div>
            <div className="text-sm text-gray-600">Müşteri Sadakat Oranı</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>En Çok Randevu Alan Müşteriler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReportData.customers.topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.appointments} randevu</div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(customer.revenue)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (reportType) {
      case 'overview': return renderOverviewReport();
      case 'revenue': return renderRevenueReport();
      case 'appointments': return renderAppointmentsReport();
      case 'customers': return renderCustomersReport();
      default: return renderOverviewReport();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Raporlar</h1>
            <p className="page-subtitle">
              Detaylı analiz ve performans raporları
            </p>
          </div>
          <Button onClick={handleExportReport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Raporu Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Date Range */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Tarih Aralığı:</span>
              </div>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-auto"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-auto"
              />
              <Button variant="outline" onClick={refetch}>
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>

            {/* Report Type */}
            <div className="flex space-x-2">
              <Button
                variant={reportType === 'overview' ? 'primary' : 'outline'}
                onClick={() => setReportType('overview')}
                size="sm"
              >
                Genel Bakış
              </Button>
              <Button
                variant={reportType === 'revenue' ? 'primary' : 'outline'}
                onClick={() => setReportType('revenue')}
                size="sm"
              >
                Gelir
              </Button>
              <Button
                variant={reportType === 'appointments' ? 'primary' : 'outline'}
                onClick={() => setReportType('appointments')}
                size="sm"
              >
                Randevular
              </Button>
              <Button
                variant={reportType === 'customers' ? 'primary' : 'outline'}
                onClick={() => setReportType('customers')}
                size="sm"
              >
                Müşteriler
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">Rapor hazırlanıyor...</div>
          </CardContent>
        </Card>
      ) : (
        renderReportContent()
      )}
    </div>
  );
}