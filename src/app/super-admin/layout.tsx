'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';
import { isSuperAdmin, isBarber } from '@/lib/role-utils';

export default function SuperAdminLayout({
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
      
      if (!isSuperAdmin(user.role)) {
        if (isBarber(user.role)) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
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

  if (!user || !isSuperAdmin(user.role)) {
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