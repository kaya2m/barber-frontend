'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export default function DashboardPage() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Redirect based on user role
      switch (user.role) {
        case 'Customer':
          router.push('/my-appointments');
          break;
        case 'Barber':
          router.push('/(admin)/dashboard');
          break;
        case 'SuperAdmin':
          router.push('/(super-admin)/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return <Loading text="Yönlendiriliyor..." />;
  }

  return <Loading text="Yönlendiriliyor..." />;
}