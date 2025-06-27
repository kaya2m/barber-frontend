'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      initialize();
    }
  }, [initialize, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loading size="lg" text="Yükleniyor..." />
      </div>
    );
  }

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loading size="lg" text="Kimlik doğrulanıyor..." />
      </div>
    );
  }

  return <>{children}</>;
}