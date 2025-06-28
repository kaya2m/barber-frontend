'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';
import { isCustomer, isBarber, isSuperAdmin } from '@/lib/role-utils';

export default function CustomerLayout({
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
      
      // Check if user has customer role
      if (!isCustomer(user.role)) {
        if (isSuperAdmin(user.role)) {
          router.push('/super-admin/superadmin-dashboard');
        } else if (isBarber(user.role)) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    }
  }, [user, isInitialized, isLoading, router]);

  // Show loading while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yetki kontrol ediliyor..." />
      </div>
    );
  }

  // Show loading if no user or wrong role
  if (!user || !isCustomer(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  return (
    <Navigation showSidebar={false}>
      {children}
    </Navigation>
  );
}