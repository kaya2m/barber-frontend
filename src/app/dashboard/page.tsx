'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { isCustomer, isBarber, isSuperAdmin } from '@/lib/role-utils';

export default function DashboardPage() {
  const { user, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Redirect based on role
      if (isSuperAdmin(user.role)) {
        router.push('/super-admin/superadmin-dashboard');
        return;
      } else if (isBarber(user.role)) {
        router.push('/admin/dashboard');
        return;
      }
      // Customer stays on this page
    }
  }, [user, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yükleniyor..." />
      </div>
    );
  }

  if (!user || !isCustomer(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Müşteri Dashboard</h1>
        <p className="page-subtitle">Hoş geldiniz, {user.firstName} {user.lastName}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Randevu Al</h3>
          <p className="text-gray-600 mb-4">Yeni randevu oluşturun</p>
          <button 
            onClick={() => router.push('/appointment')}
            className="btn-primary"
          >
            Randevu Al
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Randevularım</h3>
          <p className="text-gray-600 mb-4">Mevcut randevularınızı görüntüleyin</p>
          <button 
            onClick={() => router.push('/my-appointments')}
            className="btn-secondary"
          >
            Randevularım
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profil</h3>
          <p className="text-gray-600 mb-4">Profil bilgilerinizi güncelleyin</p>
          <button 
            onClick={() => router.push('/profile')}
            className="btn-secondary"
          >
            Profili Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}