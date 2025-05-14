import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeStampLocale'
})
export class TimeStampLocalePipe implements PipeTransform {
  transform(value: Date | string | number): string | null {
    if (!value) return null;

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
    if (isNaN(date.getTime())) return null;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}