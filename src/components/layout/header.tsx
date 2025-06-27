'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Berber Randevu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-primary-600 transition-colors">
              Hizmetler
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              İletişim
            </Link>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Dropdown
                trigger={
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <UserIcon className="w-5 h-5" />
                    <span>{user.firstName} {user.lastName}</span>
                  </button>
                }
              >
                <DropdownItem onClick={() => router.push('/dashboard')}>
                  Dashboard
                </DropdownItem>
                <DropdownItem onClick={() => router.push('/my-appointments')}>
                  Randevularım
                </DropdownItem>
                <DropdownItem onClick={() => router.push('/profile')}>
                  Profil
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  Çıkış Yap
                </DropdownItem>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  Giriş Yap
                </Button>
                <Button onClick={() => router.push('/register')}>
                  Kayıt Ol
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/services"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hizmetler
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              İletişim
            </Link>
            
            {user ? (
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <div className="text-sm text-gray-500">
                  {user.firstName} {user.lastName}
                </div>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-appointments"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Randevularım
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-primary-600"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Giriş Yap
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Kayıt Ol
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}