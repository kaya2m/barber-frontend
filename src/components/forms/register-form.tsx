    'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import type { RegisterRequest } from '@/types/auth';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('firstName')}
          label="Ad"
          placeholder="Adınız"
          error={errors.firstName?.message}
        />
        <Input
          {...register('lastName')}
          label="Soyad"
          placeholder="Soyadınız"
          error={errors.lastName?.message}
        />
      </div>

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
          {...register('phoneNumber')}
          type="tel"
          label="Telefon"
          placeholder="+90 555 123 45 67"
          error={errors.phoneNumber?.message}
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

      <div>
        <Input
          {...register('confirmPassword')}
          type="password"
          label="Şifre Tekrarı"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Kayıt Ol
      </Button>
    </form>
  );
}