import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-remove-item-dialog',
    template: `
    <div class="dialog-content m-4">
      <p>{{ confirmMessage() }}</p>
      <button class="btn btn-danger me-2" (click)="confirm()">Remove</button>
      <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
    </div>
  `,
    standalone: false
})
export class RemoveItemDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RemoveItemDialogComponent>
  ) {}
  confirmMessage(): string {
    return `Are you sure you want to remove this item?`;
  }
  confirm(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }
}
