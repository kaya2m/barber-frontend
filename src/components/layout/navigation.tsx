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

  if (showSidebar && user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex flex-1">
          <Sidebar userRole={user.role} />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}