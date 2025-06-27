'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import type { LoginRequest } from '@/types/auth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, user, isInitialized } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      router.push(callbackUrl);
    }
  }, [user, isInitialized, router, callbackUrl]);

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Giriş başarılı!');
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push(callbackUrl);
      }, 100);
    } catch (error: any) {
      toast.error(error.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if checking auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Giriş Yap</CardTitle>
            <p className="text-gray-600">Hesabınıza giriş yapın</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  placeholder="ornek@email.com"
                  error={errors.email?.message}
                />
              </div>

              <div>
                <Input
                  {...register('password')}
                  type="password"
                  label="Şifre"
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Giriş Yap
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Kayıt olun
                </Link>
              </p>
              
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Şifrenizi mi unuttunuz?
              </Link>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Demo hesaplar:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@demo.com / 123456</p>
                <p><strong>Berber:</strong> berber@demo.com / 123456</p>
                <p><strong>Müşteri:</strong> musteri@demo.com / 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}