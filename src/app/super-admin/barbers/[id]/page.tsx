'use client';

import { useParams } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

export default function BarberDetailPage() {
  const params = useParams();
  const barberId = params.id as string;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Berber Detayı</h1>
        <p className="page-subtitle">Berber ID: {barberId}</p>
      </div>
      
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Berber bilgileri yükleniyor..." />
      </div>
    </div>
  );
}