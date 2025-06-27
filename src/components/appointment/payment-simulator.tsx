'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircleIcon, XCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { PaymentSimulation } from '@/types/auth';

interface PaymentSimulatorProps {
  amount: number;
  paymentType: 'Deposit' | 'Full';
  onPaymentComplete: (result: PaymentSimulation) => void;
}

export function PaymentSimulator({ amount, paymentType, onPaymentComplete }: PaymentSimulatorProps) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentSimulation | null>(null);

  const simulatePayment = async () => {
    setProcessing(true);
    
    // 2-3 saniye bekleme simülasyonu
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // %90 başarı oranı
    const success = Math.random() > 0.1;
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const paymentResult: PaymentSimulation = {
      appointmentId: 'temp-appointment-id',
      amount,
      paymentType,
      success,
      transactionId,
    };
    
    setResult(paymentResult);
    setProcessing(false);
    
    if (success) {
      setTimeout(() => {
        onPaymentComplete(paymentResult);
      }, 1500);
    }
  };

  const resetPayment = () => {
    setResult(null);
  };

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {result.success ? (
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-600" />
            )}
            <span>Ödeme {result.success ? 'Başarılı' : 'Başarısız'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            {result.success ? (
              <>
                <div className="text-green-600 font-medium">
                  Ödemeniz başarıyla işlendi!
                </div>
                <div className="text-sm text-gray-600">
                  İşlem No: {result.transactionId}
                </div>
              </>
            ) : (
              <>
                <div className="text-red-600 font-medium">
                  Ödeme işlemi başarısız oldu.
                </div>
                <div className="text-sm text-gray-600">
                  Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.
                </div>
              </>
            )}
          </div>

          {!result.success && (
            <Button onClick={resetPayment} className="w-full">
              Tekrar Dene
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCardIcon className="w-6 h-6" />
          <span>Ödeme</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">Ödenecek Tutar</div>
            <Badge variant={paymentType === 'Full' ? 'warning' : 'info'}>
              {paymentType === 'Full' ? 'Tam Ödeme' : 'Kapora (%20)'}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {formatCurrency(amount)}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Bu bir ödeme simülasyonudur. Gerçek ödeme işlemi yapılmayacaktır.
          </div>
          <Button 
            onClick={simulatePayment} 
            loading={processing}
            className="w-full"
          >
            {processing ? 'Ödeme İşleniyor...' : 'Ödemeyi Tamamla'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}