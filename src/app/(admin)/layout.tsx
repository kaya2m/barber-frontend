'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }
      
      if (user.role !== 'Barber' && user.role !== 'SuperAdmin') {
        router.push('/');
        return;
      }
    }
  }, [user, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yetki kontrol ediliyor..." />
      </div>
    );
  }

  if (!user || (user.role !== 'Barber' && user.role !== 'SuperAdmin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  return (
    <Navigation showSidebar={true}>
      {children}
    </Navigation>
  );
}