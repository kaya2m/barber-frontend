'use client';

import { useAuth } from '@/hooks/use-auth';
import { Header } from './header';
import { Footer } from './footer';
import { Sidebar } from './sidebar';

interface NavigationProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Navigation({ children, showSidebar = false }: NavigationProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {showSidebar && user && (
          <Sidebar userRole={user.role} />
        )}
        
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}