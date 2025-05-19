import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserViewModel } from '../../../models/user-view-model';

@Component({
    selector: 'app-remove-contact-dialog',
    templateUrl: './remove-contact-dialog.component.html',
    styleUrl: './remove-contact-dialog.component.css',
    standalone: false
})
export class RemoveContactDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RemoveContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {contact: UserViewModel}
  ) {}

  actionBtn(val: boolean) {
    this.dialogRef.close(val);
  }
}
