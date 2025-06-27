'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface WorkingDay {
  day: string;
  dayName: string;
  isWorking: boolean;
  timeSlots: TimeSlot[];
}

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
    {
      day: 'monday',
      dayName: 'Pazartesi',
      isWorking: true,
      timeSlots: [
        { start: '09:00', end: '12:00', available: true },
        { start: '13:00', end: '18:00', available: true }
      ]
    },
    {
      day: 'tuesday',
      dayName: 'Salı',
      isWorking: true,
      timeSlots: [
        { start: '09:00', end: '12:00', available: true },
        { start: '13:00', end: '18:00', available: true }
      ]
    },
    {
      day: 'wednesday',
      dayName: 'Çarşamba',
      isWorking: true,
      timeSlots: [
        { start: '09:00', end: '12:00', available: true },
        { start: '13:00', end: '18:00', available: true }
      ]
    },
    {
      day: 'thursday',
      dayName: 'Perşembe',
      isWorking: true,
      timeSlots: [
        { start: '09:00', end: '12:00', available: true },
        { start: '13:00', end: '18:00', available: true }
      ]
    },
    {
      day: 'friday',
      dayName: 'Cuma',
      isWorking: true,
      timeSlots: [
        { start: '09:00', end: '12:00', available: true },
        { start: '13:00', end: '18:00', available: true }
      ]
    },
    {
      day: 'saturday',
      dayName: 'Cumartesi',
      isWorking: true,
      timeSlots: [
        { start: '10:00', end: '16:00', available: true }
      ]
    },
    {
      day: 'sunday',
      dayName: 'Pazar',
      isWorking: false,
      timeSlots: []
    }
  ]);

  const toggleWorkingDay = (dayIndex: number) => {
    const updatedDays = [...workingDays];
    updatedDays[dayIndex].isWorking = !updatedDays[dayIndex].isWorking;
    if (!updatedDays[dayIndex].isWorking) {
      updatedDays[dayIndex].timeSlots = [];
    }
    setWorkingDays(updatedDays);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updatedDays = [...workingDays];
    updatedDays[dayIndex].timeSlots.push({
      start: '09:00',
      end: '17:00',
      available: true
    });
    setWorkingDays(updatedDays);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedDays = [...workingDays];
    updatedDays[dayIndex].timeSlots.splice(slotIndex, 1);
    setWorkingDays(updatedDays);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const updatedDays = [...workingDays];
    updatedDays[dayIndex].timeSlots[slotIndex][field] = value;
    setWorkingDays(updatedDays);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Müsaitlik Ayarları</h1>
        <p className="page-subtitle">
          Çalışma saatlerinizi ve müsait olduğunuz zamanları ayarlayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Takvim</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Müsait</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Randevu Var</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Çalışmıyor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working Hours Settings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Haftalık Çalışma Programı</CardTitle>
                <Button>
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workingDays.map((day, dayIndex) => (
                  <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{day.dayName}</h3>
                        <Badge variant={day.isWorking ? 'success' : 'error'}>
                          {day.isWorking ? 'Açık' : 'Kapalı'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWorkingDay(dayIndex)}
                        >
                          {day.isWorking ? 'Kapat' : 'Aç'}
                        </Button>
                        {day.isWorking && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(dayIndex)}
                          >
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Saat Ekle
                          </Button>
                        )}
                      </div>
                    </div>

                    {day.isWorking && (
                      <div className="space-y-3">
                        {day.timeSlots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center space-x-3">
                            <Input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                              className="w-32"
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                              className="w-32"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {day.timeSlots.length === 0 && (
                          <div className="text-gray-500 text-sm italic">
                            Henüz çalışma saati eklenmedi
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <ClockIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Yarın İzinli</div>
                  <div className="text-sm text-gray-500">Yarın için randevu kabul etme</div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <ClockIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Hafta Sonu Kapalı</div>
                  <div className="text-sm text-gray-500">Cumartesi ve Pazar kapat</div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <ClockIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Varsayılan Saatler</div>
                  <div className="text-sm text-gray-500">09:00-18:00 olarak ayarla</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}