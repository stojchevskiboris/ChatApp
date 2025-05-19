import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-sign-out-dialog',
    templateUrl: './sign-out-dialog.component.html',
    styleUrl: './sign-out-dialog.component.css',
    standalone: false
})
export class SignOutDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SignOutDialogComponent>
  ) {}

  logOut(val: boolean) {
    this.dialogRef.close(val);
  }
}
