import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  transform(value: Date | any): string | null {
    if (!value || isNaN(new Date(value as any).getTime())) {
      return null;
    }
    
    const now = new Date();
    const date = new Date(value);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    
    if (diffInMinutes <= 1){
      return 'just now';
    }

    if (diffInMinutes <= 2){
      return 'a minute ago';
    }

    // If within the last 5 minutes
    if (diffInMinutes < 5) {
      return 'a few minutes ago';
    }

    // If within 5 to 30 minutes
    if (diffInMinutes >= 5 && diffInMinutes <= 30) {
      return `${diffInMinutes}m ago`;
    }

    // If within the same day and more than 30 minutes ago
    if (
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear()
    ) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If yesterday or within the last week
    const diffInDays = Math.floor(diffInMinutes / (60 * 24));
    if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // If within the same year and more than 7 days ago
    if (now.getFullYear() === date.getFullYear()) {
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    }

    // If from a previous year
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

}
