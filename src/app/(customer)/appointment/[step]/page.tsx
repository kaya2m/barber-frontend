'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppointmentStore } from '@/store/appointment-store';

export default function AppointmentStepPage() {
  const params = useParams();
  const router = useRouter();
  const { setStep } = useAppointmentStore();
  const step = parseInt(params.step as string);

  useEffect(() => {
    if (step >= 1 && step <= 5) {
      setStep(step);
      router.replace('/appointment');
    } else {
      router.replace('/appointment');
    }
  }, [step, setStep, router]);

  return null; 
}
