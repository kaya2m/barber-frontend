'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AppointmentList } from '@/components/dashboard/appointment-list';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { Appointment, RecentActivity } from '@/types/auth';

// Type definitions
interface DashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyRevenue: number;
  completedAppointments: number;
  pendingAppointments: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'admin' | 'barber' | 'customer';
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  serviceType: string;
  isActive: boolean;
  requiresFullPayment: boolean;
}

interface Payment {
  id: string;
  appointmentId: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  amount: number;
  paymentType: 'Deposit' | 'Full' | 'Remaining';
  transactionId?: string;
  createdAt: string;
}

type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';





// API functions with proper typing
async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/dashboard/barber-stats');
  return response.data as DashboardStats;
}

async function getTodayAppointments(): Promise<Appointment[]> {
  const response = await api.get('/appointments/today');
  return response.data as Appointment[];
}

async function getRecentActivities(): Promise<RecentActivity[]> {
  const response = await api.get('/dashboard/recent-activities');
  return response.data as RecentActivity[];
}

export default function BarberDashboardPage() {
  const { user } = useAuth();
  
  // Typed API calls
  const { data: stats, loading: statsLoading } = useApi<DashboardStats>(getDashboardStats);
  const { data: todayAppointments, loading: appointmentsLoading } = useApi<Appointment[]>(getTodayAppointments);
  const { data: activities, loading: activitiesLoading } = useApi<RecentActivity[]>(getRecentActivities);

  // Mock data with proper typing
  const mockStats: DashboardStats = {
    todayAppointments: 8,
    weeklyAppointments: 35,
    monthlyRevenue: 3250,
    completedAppointments: 142,
    pendingAppointments: 3
  };

  const mockAppointments: Appointment[] = [];

  const mockActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'appointment_confirmed',
      description: 'Ahmet Yılmaz randevusunu onayladınız',
      timestamp: new Date().toISOString(),
      userId: '1',
      userName: 'Ahmet Yılmaz'
    },
    {
      id: '2',
      type: 'appointment_created',
      description: 'Yeni randevu talebi geldi',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      userId: '2',
      userName: 'Mehmet Kaya'
    }
  ];

  const dashboardStats = stats ?? mockStats;
  const appointments = todayAppointments ?? mockAppointments;
  const recentActivities = activities ?? mockActivities;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Hoş geldiniz, {user?.firstName}!
        </h1>
        <p className="page-subtitle">
          Bugünkü randevularınız ve genel durum
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Bugünkü Randevular"
          value={dashboardStats.todayAppointments}
          icon={CalendarIcon}
          color="blue"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Bu Hafta"
          value={dashboardStats.weeklyAppointments}
          icon={ClockIcon}
          color="green"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Aylık Gelir"
          value={`₺${dashboardStats.monthlyRevenue}`}
          icon={CurrencyDollarIcon}
          color="yellow"
          change={{ value: 15, type: 'increase' }}
        />
        <StatsCard
          title="Bekleyen Randevular"
          value={dashboardStats.pendingAppointments}
          icon={UserGroupIcon}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="space-y-6">
          <AppointmentList
            title="Bugünkü Randevular"
            appointments={appointments}
            showActions={true}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Müsaitlik Ayarla</div>
                    <div className="text-sm text-gray-500">Çalışma saatlerinizi düzenleyin</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Bekleyen Onaylar</div>
                    <div className="text-sm text-gray-500">Randevu onaylarınızı kontrol edin</div>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="space-y-6">
          <RecentActivities activities={recentActivities} />
          <Card>
            <CardHeader>
              <CardTitle>Bu Hafta Performans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tamamlanan Randevular</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gelir Hedefi</span>
                  <span className="font-semibold">₺3,250 / ₺4,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}