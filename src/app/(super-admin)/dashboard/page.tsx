// src/app/(super-admin)/dashboard/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AppointmentList } from '@/components/dashboard/appointment-list';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TrendingUpIcon } from 'lucide-react';
import { Appointment } from '@/types/auth';

interface SuperAdminStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalAppointments: number;
  monthlyAppointments: number;
  totalCustomers: number;
  activeBarbers: number;
  pendingAppointments: number;
  completionRate: number;
}


interface Activity {
  id: string;
  type: "appointment_created" | "payment_completed" | "appointment_confirmed" | "appointment_cancelled";
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}
async function getSuperAdminStats(): Promise<SuperAdminStats> {
  const response = await api.get('/dashboard/super-admin-stats');
  return response.data as SuperAdminStats;
}

async function getAllAppointments(): Promise<Appointment[]> {
  const response = await api.get('/appointments/all');
  return response.data as Appointment[];
}

async function getRecentActivities(): Promise<Activity[]> {
  const response = await api.get('/dashboard/activities');
  return response.data as Activity[];
}
export default function SuperAdminDashboardPage() {
  const { user } = useAuth();
  const { data: stats, loading: statsLoading } = useApi(getSuperAdminStats);
  const { data: appointments, loading: appointmentsLoading } = useApi(getAllAppointments);
  const { data: activities, loading: activitiesLoading } = useApi(getRecentActivities);

  // Mock data for development
  const mockStats = {
    totalRevenue: 45250,
    monthlyRevenue: 12340,
    totalAppointments: 1250,
    monthlyAppointments: 180,
    totalCustomers: 420,
    activeBarbers: 5,
    pendingAppointments: 15,
    completionRate: 94.5
  };

  const mockRecentAppointments: Appointment[] = [
    {
      id: '1',
      customerId: '101',
      barberId: '201',
      salonId: '301',
      serviceId: '401',
      customer: { id: '101', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@example.com', phoneNumber: '5551234567', role: 'Customer', isActive: true, createdAt: new Date().toISOString() },
      barber: { id: '201', firstName: 'Mehmet', lastName: 'Kılıç', email: 'mehmet@example.com', phoneNumber: '5551234568', role: 'Barber', isActive: true, createdAt: new Date().toISOString() },
      appointmentDate: new Date().toISOString(),
      status: 'Pending',
      totalAmount: 150,
      depositAmount: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      customerId: '102',
      barberId: '202',
      salonId: '301',
    serviceId: '401',
      customer: { id: '102', firstName: 'Ali', lastName: 'Demir', email: 'ali@example.com', phoneNumber: '5551112233', role: 'Customer', isActive: true, createdAt: new Date().toISOString() },
      barber: { id: '202', firstName: 'Kemal', lastName: 'Arslan', email: 'kemal@example.com', phoneNumber: '5554445566', role: 'Barber', isActive: true, createdAt: new Date().toISOString() },
      appointmentDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'Confirmed',
      totalAmount: 80,
      depositAmount: 20,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockActivities = [
    {
      id: '1',
      type: 'appointment_created',
      description: 'Yeni VIP randevu talebi - Ahmet Yılmaz',
      timestamp: new Date().toISOString(),
      userId: '1',
      userName: 'Ahmet Yılmaz'
    },
    {
      id: '2',
      type: 'payment_completed',
      description: 'Ödeme tamamlandı - ₺150',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      userId: '2',
      userName: 'Ali Demir'
    },
    {
      id: '3',
      type: 'appointment_confirmed',
      description: 'Randevu onaylandı - Mehmet Kaya',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      userId: '3',
      userName: 'Mehmet Kaya'
    },
    {
      id: '4',
      type: 'appointment_cancelled',
      description: 'Randevu iptal edildi - Can Özkan',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      userId: '4',
      userName: 'Can Özkan'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Admin Dashboard
        </h1>
        <p className="page-subtitle">
          Genel durum ve işletme performansı
        </p>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Toplam Gelir"
          value={formatCurrency(stats?.totalRevenue || mockStats.totalRevenue)}
          icon={CurrencyDollarIcon}
          color="green"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Aylık Gelir"
          value={formatCurrency(stats?.monthlyRevenue || mockStats.monthlyRevenue)}
          icon={TrendingUpIcon}
          color="blue"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Toplam Müşteri"
          value={stats?.totalCustomers || mockStats.totalCustomers}
          icon={UserGroupIcon}
          color="purple"
          change={{ value: 5, type: 'increase' }}
        />
        <StatsCard
          title="Bekleyen Randevular"
          value={stats?.pendingAppointments || mockStats.pendingAppointments}
          icon={ClockIcon}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bu Ay Randevu</p>
                <p className="text-2xl font-bold">{stats?.monthlyAppointments || mockStats.monthlyAppointments}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Berber</p>
                <p className="text-2xl font-bold">{stats?.activeBarbers || mockStats.activeBarbers}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlanma Oranı</p>
                <p className="text-2xl font-bold">%{stats?.completionRate || mockStats.completionRate}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Randevu</p>
                <p className="text-2xl font-bold">{stats?.totalAppointments || mockStats.totalAppointments}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="space-y-6">
          <AppointmentList
            title="Son Randevular"
            appointments={appointments?.slice(0, 5) || mockRecentAppointments}
            showActions={true}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Berber Ekle</div>
                    <div className="text-sm text-gray-500">Yeni berber kaydet</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Raporları Görüntüle</div>
                    <div className="text-sm text-gray-500">Detaylı analiz ve raporlar</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-medium">VIP Randevular</div>
                    <div className="text-sm text-gray-500">VIP randevu onayları</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">Bekleyen Onaylar</div>
                    <div className="text-sm text-gray-500">{mockStats.pendingAppointments} randevu bekliyor</div>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Activities & Performance */}
        <div className="space-y-6">
          {/* <RecentActivities activities={activities || mockActivities} /> */}
          
          <Card>
            <CardHeader>
              <CardTitle>Bu Ay Performans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hedef Gelir</span>
                  <span className="font-semibold">₺12,340 / ₺15,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kapasité Kullanımı</span>
                  <span className="font-semibold">%85</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Randevu Tamamlama</span>
                  <span className="font-semibold">%{mockStats.completionRate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm">API Durumu</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Çevrimiçi</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Ödeme Sistemi</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Aktif</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Bildirim Servisi</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Çalışıyor</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Yedekleme</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">Zamanlandı</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Aylık Genel Bakış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {mockStats.monthlyAppointments}
                </div>
                <div className="text-sm text-gray-600">Bu Ay Randevu</div>
                <div className="text-xs text-green-600 mt-1">↗ +12% geçen aya göre</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(mockStats.monthlyRevenue)}
                </div>
                <div className="text-sm text-gray-600">Bu Ay Gelir</div>
                <div className="text-xs text-green-600 mt-1">↗ +8% geçen aya göre</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  23
                </div>
                <div className="text-sm text-gray-600">Yeni Müşteri</div>
                <div className="text-xs text-green-600 mt-1">↗ +15% geçen aya göre</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  4.8
                </div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
                <div className="text-xs text-green-600 mt-1">↗ +0.2 geçen aya göre</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}