'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';

export default function AppointmentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Randevu Başarıyla Oluşturuldu!
            </h1>
            <p className="text-gray-600">
              Randevunuz onaylandıktan sonra size bilgilendirme mesajı gönderilecektir.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/my-appointments" className="block">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Randevularımı Görüntüle
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Not:</strong> Randevunuzun onaylanması genellikle 1-2 saat sürmektedir. 
              Acil durumlar için doğrudan salon ile iletişime geçebilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}