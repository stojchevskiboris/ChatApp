import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeLocale'
})
export class DateTimeLocalePipe implements PipeTransform {

  transform(value: Date | string | number): string | null {
    if (!value) return null;

    // Set the locale to the required one (de-DE for European style: dd.MM.yyyy, HH:mm)
    const locale = 'de-DE';

    let date: Date;
    
    if (typeof value === 'string') {
      if (value.includes('T')) {
        // ISO string, append 'Z' if missing (tells JS it's UTC)
        date = new Date(value.endsWith('Z') ? value : value + 'Z');
      } else {
        // This is a local format like "Sun Apr 27 2025 17:39:15 GMT+0200"
        date = new Date(value); // This will correctly parse the local time string
      }
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return null;

    // Format the date part as dd.MM.yyyy
    const datePart = date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Format the time part as HH:mm (24-hour format)
    const timePart = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Ensures 24-hour format
    });

    return `${datePart}, ${timePart}`;
  }
}
