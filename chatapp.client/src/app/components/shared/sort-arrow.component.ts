import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sort-arrow',
  template: `
    <span *ngIf="isAsc; else downArrow">&#9650;</span>
    <ng-template #downArrow>&#9660;</ng-template>
  `,
  styles: [':host { margin-left: 4px; font-size: 0.9em; }']
})
export class SortArrowComponent {
  @Input() isAsc: boolean = true;
}
