import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';

export function formatRelativeDate(date: string | Date): string {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Bugün';
  }
  
  if (isTomorrow(dateObj)) {
    return 'Yarın';
  }
  
  if (isYesterday(dateObj)) {
    return 'Dün';
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: tr 
  });
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = format(start, 'd MMMM yyyy', { locale: tr });
  const endFormatted = format(end, 'd MMMM yyyy', { locale: tr });
  
  if (startFormatted === endFormatted) {
    return startFormatted;
  }
  
  return `${startFormatted} - ${endFormatted}`;
}

export function formatTimeSlot(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + duration);
  
  const startFormatted = format(start, 'HH:mm');
  const endFormatted = format(end, 'HH:mm');
  
  return `${startFormatted} - ${endFormatted}`;
}

export function getWorkingHours() {
  return {
    start: '09:00',
    end: '21:00',
    breakStart: '12:00',
    breakEnd: '13:00',
  };
}

export function isWorkingHour(time: string): boolean {
  const workingHours = getWorkingHours();
  const [hours, minutes] = time.split(':').map(Number);
  const timeMinutes = hours * 60 + minutes;
  
  const [startHours, startMinutes] = workingHours.start.split(':').map(Number);
  const startTimeMinutes = startHours * 60 + startMinutes;
  
  const [endHours, endMinutes] = workingHours.end.split(':').map(Number);
  const endTimeMinutes = endHours * 60 + endMinutes;
  
  const [breakStartHours, breakStartMinutes] = workingHours.breakStart.split(':').map(Number);
  const breakStartTimeMinutes = breakStartHours * 60 + breakStartMinutes;
  
  const [breakEndHours, breakEndMinutes] = workingHours.breakEnd.split(':').map(Number);
  const breakEndTimeMinutes = breakEndHours * 60 + breakEndMinutes;
  
  // Check if time is within working hours
  if (timeMinutes < startTimeMinutes || timeMinutes > endTimeMinutes) {
    return false;
  }
  
  // Check if time is during break
  if (timeMinutes >= breakStartTimeMinutes && timeMinutes < breakEndTimeMinutes) {
    return false;
  }
  
  return true;
}

export function generateTimeSlots(intervalMinutes: number = 30): string[] {
  const slots: string[] = [];
  const workingHours = getWorkingHours();
  
  const [startHours, startMinutes] = workingHours.start.split(':').map(Number);
  const [endHours, endMinutes] = workingHours.end.split(':').map(Number);
  
  const currentTime = new Date();
  currentTime.setHours(startHours, startMinutes, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(endHours, endMinutes, 0, 0);
  
  while (currentTime < endTime) {
    const timeStr = format(currentTime, 'HH:mm');
    
    if (isWorkingHour(timeStr)) {
      slots.push(timeStr);
    }
    
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }
  
  return slots;
}
