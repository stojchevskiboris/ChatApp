import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';
import { UserAdminViewModel } from '../../../../../models/user-admin-view-model';

@Component({
  selector: 'app-update-role-modal',
  templateUrl: './update-role-modal.component.html',
  styleUrls: ['./update-role-modal.component.css']
})
export class UpdateRoleModalComponent implements OnInit {
  model: any = {};
  loading = false;

  roles = [
    { value: 0, label: 'User' },
    { value: 1, label: 'Moderator' },
    { value: 2, label: 'Admin' }
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserAdminViewModel },
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.model = { userId: this.data.user.id, role: this.data.user.role };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.adminService.updateUserRole(this.model).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success('Role updated successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to update role');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to update role');
      }
    });
  }
}
