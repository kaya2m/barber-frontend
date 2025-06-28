'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { useAuth } from '@/hooks/use-auth';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  Scissors
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { user } = useAuth();

  // Mock stats for Super Admin
  const mockStats = {
    totalAppointments: 156,
    totalBarbers: 8,
    monthlyRevenue: 12450,
    totalCustomers: 89,
    todayAppointments: 23,
    pendingApprovals: 5
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Hoş geldiniz, {user?.firstName}! (Super Admin)
        </h1>
        <p className="page-subtitle">
          Sistem genel durumu ve yönetim paneli
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Toplam Randevu"
          value={mockStats.totalAppointments}
          icon={Calendar}
          color="blue"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Aktif Berber"
          value={mockStats.totalBarbers}
          icon={Scissors}
          color="green"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Aylık Gelir"
          value={`₺${mockStats.monthlyRevenue}`}
          icon={DollarSign}
          color="yellow"
          change={{ value: 15, type: 'increase' }}
        />
        <StatsCard
          title="Toplam Müşteri"
          value={mockStats.totalCustomers}
          icon={Users}
          color="purple"
          change={{ value: 5, type: 'increase' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Bugünkü Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bugünkü Randevular</span>
                <span className="font-bold text-2xl text-blue-600">{mockStats.todayAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bekleyen Onaylar</span>
                <span className="font-bold text-2xl text-orange-600">{mockStats.pendingApprovals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bugünkü Gelir</span>
                <span className="font-bold text-2xl text-green-600">₺1,240</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">Berber Yönetimi</div>
                  <div className="text-sm text-gray-500">Berber ekle, düzenle veya sil</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Scissors className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">Hizmet Yönetimi</div>
                  <div className="text-sm text-gray-500">Hizmetleri ve fiyatları düzenle</div>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium">Raporlar</div>
                  <div className="text-sm text-gray-500">Detaylı analiz ve raporları görüntüle</div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Yeni berber eklendi: Hasan Demir</p>
                  <p className="text-xs text-gray-500">2 saat önce</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">15 yeni randevu oluşturuldu</p>
                  <p className="text-xs text-gray-500">4 saat önce</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">VIP Paket hizmet fiyatı güncellendi</p>
                  <p className="text-xs text-gray-500">1 gün önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Bu Ay Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hedef Gelir</span>
                <span className="font-semibold">₺12,450 / ₺15,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Randevu Tamamlama</span>
                <span className="font-semibold">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}