import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
  className?: string;
}

export function Calendar({ selectedDate, onDateSelect, disabledDates = [], className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isDisabled = disabledDates.some(disabledDate => isSameDay(day, disabledDate)) || day < new Date();
      days.push(
        <div
          key={day.toString()}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium transition-colors",
            !isSameMonth(day, monthStart) && "text-gray-400",
            isSameDay(day, selectedDate || new Date()) && "bg-primary-600 text-white",
            !isSameDay(day, selectedDate || new Date()) && isSameMonth(day, monthStart) && "hover:bg-gray-100",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isDisabled && onDateSelect(cloneDay)}
        >
          <span>{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className={cn("p-4 bg-white rounded-lg border", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: tr })}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
          <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  );
}