import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';

@Component({
  selector: 'app-save-group-user-modal',
  templateUrl: './save-group-user-modal.component.html',
  styleUrls: ['./save-group-user-modal.component.css']
})
export class SaveGroupUserModalComponent implements OnInit {
  model: any = { groupId: null, userId: null };
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<SaveGroupUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.model.groupId || !this.model.userId) {
      this.toastr.warning('Group ID and User ID are required');
      return;
    }
    this.loading = true;
    this.adminService.saveGroupUser(this.model).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success('Group user added successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to add group user');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to add group user');
      }
    });
  }
}
