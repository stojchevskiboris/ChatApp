import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';
import { UserViewModel } from '../../../../../models/user-view-model';

@Component({
  selector: 'app-save-user-modal',
  templateUrl: './save-user-modal.component.html',
  styleUrls: ['./save-user-modal.component.css']
})
export class SaveUserModalComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    gender: 0,
    confirmPassword: '',
    dateOfBirth: '',
    phone: ''
  };
  loading = false;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<SaveUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId?: number },
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.userId) {
      this.isEdit = true;
      this.loading = true;
      this.adminService.getUserById(this.data.userId).subscribe({
        next: (res) => {
          const u = res.data;
          this.user = {
            id: u.id || 0,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            username: u.username || '',
            password: '',
            gender: u.gender || 0,
            confirmPassword: '',
            dateOfBirth: u.dateOfBirth || '',
            phone: u.phone || ''
          };
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load user details');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.adminService.saveOrUpdateUser(this.user).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success(this.isEdit ? 'User updated successfully' : 'User created successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to save user');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to save user');
      }
    });
  }
}
