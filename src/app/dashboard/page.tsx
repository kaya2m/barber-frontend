'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export default function DashboardPage() {
  const { user, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      switch (user.role) {
        case 'SuperAdmin':
          router.replace('/admin/dashboard');
          break;
        case 'Barber':
          router.replace('/admin/dashboard');
          break;
        case 'Customer':
          router.replace('/customer/my-appointments');
          break;
        default:
          router.replace('/');
          break;
      }
    }
  }, [user, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loading size="lg" text="Yönlendiriliyor..." />
    </div>
  );
}