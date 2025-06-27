'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { TIME_SLOTS } from '@/lib/constants';

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  unavailableSlots?: string[];
}

export function DateTimePicker({ 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect,
  unavailableSlots = []
}: DateTimePickerProps) {
  const isTimeSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    const slotDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${time}`;
    return !unavailableSlots.includes(slotDateTime);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Tarih Seçin</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Saat Seçin</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => {
                const isAvailable = isTimeSlotAvailable(time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => isAvailable && onTimeSelect(time)}
                    disabled={!isAvailable}
                    className={cn(
                      'p-3 rounded-lg text-sm font-medium transition-colors',
                      isSelected 
                        ? 'bg-primary-600 text-white'
                        : isAvailable
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Önce bir tarih seçin
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
