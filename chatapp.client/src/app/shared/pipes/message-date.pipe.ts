import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
    name: 'messageDate',
    standalone: false
})
export class MessageDatePipe implements PipeTransform {

  transform(value: Date | string | number): string | null {
    if (!value) return null;

    const locale = 'en-US';
    let date: Date;

if (typeof value === 'string') {
      if (value.includes('T')) {
        // ISO string, append 'Z' if missing (tells JS it's UTC)
        date = new Date(value.endsWith('Z') ? value : value + 'Z');
      } else {
        // Basic datetime string, add ' UTC' at the end
        date = new Date(value + ' UTC');
      }
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return null;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysAgo7 = new Date(todayStart);
    daysAgo7.setDate(todayStart.getDate() - 6);

    if (date >= todayStart) {
      return 'Today';
    } else if (date >= daysAgo7) {
      return format(date, 'EEEE'); // Ex: "Sunday"
    } else {
      return format(date, 'dd.MM.yyyy'); // Ex: "27.04.2025"
    }
  }
}