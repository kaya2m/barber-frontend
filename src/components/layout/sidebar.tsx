'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings,
  BarChart3,
  Scissors
} from 'lucide-react';

interface SidebarProps {
  userRole: 'Customer' | 'Barber' | 'SuperAdmin';
}

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
}

function SidebarItem({ href, icon, children, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const customerMenuItems = [
    { href: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { href: '/appointment', icon: <Calendar className="w-5 h-5" />, label: 'Randevu Al' },
    { href: '/my-appointments', icon: <Calendar className="w-5 h-5" />, label: 'Randevularım' },
    { href: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Profil' },
  ];

  const barberMenuItems = [
    { href: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Randevular' },
    { href: '/availability', icon: <Calendar className="w-5 h-5" />, label: 'Müsaitlik' },
    { href: '/customers', icon: <Users className="w-5 h-5" />, label: 'Müşteriler' },
    { href: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Profil' },
  ];

  const superAdminMenuItems = [
    { href: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Tüm Randevular' },
    { href: '/barbers', icon: <Users className="w-5 h-5" />, label: 'Berberler' },
    { href: '/services', icon: <Scissors className="w-5 h-5" />, label: 'Hizmetler' },
    { href: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Raporlar' },
    { href: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Ayarlar' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'Customer':
        return customerMenuItems;
      case 'Barber':
        return barberMenuItems;
      case 'SuperAdmin':
        return superAdminMenuItems;
      default:
        return customerMenuItems;
    }
  };

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {getMenuItems().map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={pathname === item.href}
          >
            {item.label}
          </SidebarItem>
        ))}
      </nav>
    </div>
  );
}