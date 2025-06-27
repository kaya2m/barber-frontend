'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceSelector } from '@/components/appointment/service-selector';
import { BarberSelector } from '@/components/appointment/barber-selector';
import { DateTimePicker } from '@/components/appointment/date-time-picker';
import { AppointmentSummary } from '@/components/appointment/appointment-summary';
import { PaymentSimulator } from '@/components/appointment/payment-simulator';
import { useAppointmentStore } from '@/store/appointment-store';
import { useApi } from '@/hooks/use-api';
import { Service, User, PaymentSimulation } from '@/types/auth';
import { CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Mock API functions
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Klasik Kesim',
    description: 'Geleneksel saç kesimi ve şampuan',
    price: 50,
    duration: 30,
    serviceType: 'Regular',
    isActive: true,
    requiresFullPayment: false
  },
  {
    id: '2',
    name: 'Saç + Sakal',
    description: 'Saç kesimi ve sakal tıraşı',
    price: 80,
    duration: 45,
    serviceType: 'Regular',
    isActive: true,
    requiresFullPayment: false
  },
  {
    id: '3',
    name: 'VIP Oda Hizmeti',
    description: 'Özel odada VIP hizmet paketi',
    price: 150,
    duration: 60,
    serviceType: 'VIPRoom',
    isActive: true,
    requiresFullPayment: true
  }
];

const mockBarbers: User[] = [
  {
    id: '1',
    firstName: 'Mehmet',
    lastName: 'Kılıç',
    email: 'mehmet@berber.com',
    phoneNumber: '0555 111 22 33',
    role: 'Barber',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    firstName: 'Kemal',
    lastName: 'Arslan',
    email: 'kemal@berber.com',
    phoneNumber: '0555 222 33 44',
    role: 'SuperAdmin',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export default function CustomerAppointmentPage() {
  const { formData, setServiceId, setBarberId, setAppointmentDate, setAppointmentTime, setNotes, resetForm } = useAppointmentStore();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotesState] = useState<string>('');

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setServiceId(service.id);
  };

  const handleBarberSelect = (barber: User) => {
    setSelectedBarber(barber);
    setBarberId(barber.id);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setAppointmentDate(date.toISOString());
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setAppointmentTime(time);
  };

  const handlePaymentComplete = (result: PaymentSimulation) => {
    if (result.success) {
      toast.success('Randevu başarıyla oluşturuldu!');
      resetForm();
      setStep(1);
      // Redirect to my appointments
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Hizmet Seçin';
      case 2: return 'Berber Seçin';
      case 3: return 'Tarih ve Saat Seçin';
      case 4: return 'Randevu Özeti';
      case 5: return 'Ödeme';
      default: return 'Randevu Al';
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null;
      case 2: return selectedBarber !== null;
      case 3: return selectedDate !== null && selectedTime !== '';
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="page-container max-w-6xl">
      <div className="page-header">
        <h1 className="page-title">Randevu Al</h1>
        <p className="page-subtitle">
          Adım {step}/5: {getStepTitle()}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step > stepNum ? <CheckIcon className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 5 && (
                <div className={`
                  flex-1 h-px mx-4
                  ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{getStepTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <ServiceSelector
                  services={mockServices}
                  selectedServiceId={selectedService?.id}
                  onServiceSelect={handleServiceSelect}
                />
              )}

              {step === 2 && (
                <BarberSelector
                  barbers={mockBarbers}
                  selectedBarberId={selectedBarber?.id}
                  onBarberSelect={handleBarberSelect}
                  serviceType={selectedService?.serviceType}
                />
              )}

              {step === 3 && (
                <DateTimePicker
                  selectedDate={selectedDate || undefined}
                  selectedTime={selectedTime}
                  onDateSelect={handleDateSelect}
                  onTimeSelect={handleTimeSelect}
                />
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <AppointmentSummary
                    service={selectedService || undefined}
                    barber={selectedBarber || undefined}
                    appointmentDate={selectedDate || undefined}
                    appointmentTime={selectedTime}
                    notes={notes}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notlar (Opsiyonel)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => {
                        setNotesState(e.target.value);
                        setNotes(e.target.value);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Özel istekleriniz veya notlarınız..."
                    />
                  </div>
                </div>
              )}

              {step === 5 && selectedService && (
                <PaymentSimulator
                  amount={selectedService.requiresFullPayment ? selectedService.price : selectedService.price * 0.2}
                  paymentType={selectedService.requiresFullPayment ? 'Full' : 'Deposit'}
                  onPaymentComplete={handlePaymentComplete}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Geri
            </Button>
            
            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                İleri
              </Button>
            ) : null}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div>
          <AppointmentSummary
            service={selectedService || undefined}
            barber={selectedBarber || undefined}
            appointmentDate={selectedDate || undefined}
            appointmentTime={selectedTime}
            notes={notes}
          />
        </div>
      </div>
    </div>
  );
}