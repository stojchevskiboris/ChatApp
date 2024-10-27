import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastActive'
})
export class LastActivePipe implements PipeTransform {

  transform(value: Date | any): string | null {
    if (!value || isNaN(new Date(value as any).getTime())) {
      return null;
    }

    const now = new Date();
    const date = new Date(value);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    // If within the last 5 minutes
    if (diffInMinutes < 5) {
      return 'Active now';
    }

    // If within 5 to 55 minutes
    if (diffInMinutes >= 5 && diffInMinutes <= 55) {
      const roundedMinutes = Math.ceil(diffInMinutes / 5) * 5;
      return `${roundedMinutes}m ago`;
    }

    // If within 1 hour to 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInMinutes > 55 && diffInMinutes <= 24 * 60) {
      return `${diffInHours}h ago`;
    }

    // value is null or is from long time ago
    return null;
  }
}
