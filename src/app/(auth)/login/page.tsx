'use client';

import { useState } from 'react';
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
  const { login } = useAuth();
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

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Giriş başarılı!');
      router.push(callbackUrl);
    } catch (error: any) {
      toast.error(error.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
        <p className="text-gray-600">Hesabınıza giriş yapın</p>
      </CardHeader>
      <CardContent>
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Kayıt olun
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Şifrenizi mi unuttunuz?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}