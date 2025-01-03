import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-media-dialog',
  templateUrl: './remove-media-dialog.component.html',
  styleUrl: './remove-media-dialog.component.css'
})
export class RemoveMediaDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RemoveMediaDialogComponent>
  ) {}

  remove(val: boolean) {
    this.dialogRef.close(val);
  }
}
