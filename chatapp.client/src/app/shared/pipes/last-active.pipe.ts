import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lastActive',
    standalone: false
})
export class LastActivePipe implements PipeTransform {
  transform(value: Date | any): string | null {

    var date: Date;

    if (typeof value === 'string') {
      if (value.includes('T')) {
        date = new Date(value.endsWith('Z') ? value : value + 'Z');
      } else {
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
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // If within the last 5 minutes
    if (diffInMinutes < 5) {
      return 'Active now';
    }

    // If within 5 to 55 minutes
    if (diffInMinutes >= 5 && diffInMinutes <= 59) {
      // const roundedMinutes = Math.ceil(diffInMinutes / 5) * 5;
      return `${diffInMinutes}m ago`;
    }

    // If within 1 hour to 24 hours
    if (diffInMinutes > 59 && diffInMinutes <= 24 * 60) {
      return `${diffInHours}h ago`;
    }

    // If within 1 to 6 days
    if (diffInDays >= 1 && diffInDays <= 6) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }

    // If within 7 to 14 days
    if (diffInDays >= 7 && diffInDays <= 14) {
      return 'about a week ago';
    }

    // For dates older than 3 days, you can return null or a default value
    return null;
  }
}
