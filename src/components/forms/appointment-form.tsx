'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { appointmentSchema } from '@/lib/validations';
import { useAppointment } from '@/hooks/use-appointment';
import { CreateAppointmentRequest } from '@/types/auth';

interface AppointmentFormProps {
  onSuccess?: () => void;
  prefilledData?: Partial<CreateAppointmentRequest>;
}

export function AppointmentForm({ onSuccess, prefilledData }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const { createAppointment } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAppointmentRequest>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: prefilledData,
  });

  const onSubmit = async (data: CreateAppointmentRequest) => {
    setLoading(true);
    try {
      await createAppointment(data);
      toast.success('Randevu başarıyla oluşturuldu!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Randevu oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('serviceId')}
          label="Hizmet ID"
          placeholder="Hizmet seçiniz"
          error={errors.serviceId?.message}
        />
      </div>

      <div>
        <Input
          {...register('barberId')}
          label="Berber ID"
          placeholder="Berber seçiniz"
          error={errors.barberId?.message}
        />
      </div>

      <div>
        <Input
          {...register('appointmentDate')}
          type="datetime-local"
          label="Randevu Tarihi"
          error={errors.appointmentDate?.message}
        />
      </div>

      <div>
        <Input
          {...register('notes')}
          label="Notlar (Opsiyonel)"
          placeholder="Özel istekleriniz..."
          error={errors.notes?.message}
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Randevu Oluştur
      </Button>
    </form>
  );
}
