import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatDate',
    standalone: false
})
export class ChatDatePipe implements PipeTransform {

  transform(value: Date | string | number): string | null {
    if (!value) return null;

    const locale = 'en-US';
    let date: Date;

    // ⚡ Handle string timestamps properly
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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes <= 1) return 'just now';
    if (diffInMinutes <= 2) return 'a minute ago';
    if (diffInMinutes < 5) return 'a few minutes ago';
    if (diffInMinutes <= 30) return `${diffInMinutes}m ago`;

    if (
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear()
    ) {
      return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    const diffInDays = Math.floor(diffInMinutes / (60 * 24));
    if (diffInDays < 7) {
      return date.toLocaleDateString(locale, { weekday: 'long' });
    }

    if (now.getFullYear() === date.getFullYear()) {
      return date.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
    }

    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  }

}
