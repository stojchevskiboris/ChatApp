import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'messageDate'
})
export class MessageDatePipe implements PipeTransform {

  transform(value: Date | any): string | null {
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const daysAgo7 = new Date(todayStart);
    daysAgo7.setDate(todayStart.getDate() - 6);

    if (date >= todayStart) {
      return 'Today';
    } else if (date >= daysAgo7) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'dd.MM.yyyy'); 
    }
  }
}