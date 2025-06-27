'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      } else if (user.role !== 'SuperAdmin') {
        router.push('/dashboard');
      }
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return <Loading />;
  }

  if (!user || user.role !== 'SuperAdmin') {
    return <Loading />;
  }

  return (
    <Navigation showSidebar={true}>
      {children}
    </Navigation>
  );
}