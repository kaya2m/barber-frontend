'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import type { LoginRequest } from '@/types/auth';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
  );
}