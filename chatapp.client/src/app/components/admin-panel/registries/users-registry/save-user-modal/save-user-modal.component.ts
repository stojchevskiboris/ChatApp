import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';
import { UserViewModel } from '../../../../../models/user-view-model';
import { ChangePasswordAdminModel } from '../../../../../models/change-password-admin-model';

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

  // Password tab model and logic
  passwordModel: ChangePasswordAdminModel = {
    userId: 0,
    newPassword: '',
  };
  passwordFormNotEmpty: boolean = false;

  // Picture tab logic
  profilePicture: string = 'assets/img/default-avatar.png';
  hasProfilePicture: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SaveUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId?: number },
    private adminService: AdminService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
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
          this.passwordModel.userId = u.id;
          this.profilePicture = u.profilePictures;
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load user details');
          this.loading = false;
        }
      });
    }
    this.cdr.detectChanges();
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

  onPwFormChange() {
    this.passwordFormNotEmpty = !!this.passwordModel.newPassword;
  }

  changePassword() {
    if (!this.passwordFormNotEmpty) return;
    this.loading = true;

    this.adminService.changeUserPassword(this.passwordModel).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success('Password changed successfully');
          this.passwordModel.newPassword = '';
          this.passwordFormNotEmpty = false;
        } else {
          this.toastr.error(res.message || 'Failed to change password');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to change password');
      }
    });
  }

  // Picture tab logic
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.changePicture(file);
    }
  }

  changePicture(file: File): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', file);
    this.adminService.uploadUserProfilePicture(formData)
    .subscribe({
      next: (response) => {
        if (response.url) {
          this.hasProfilePicture = true;
          this.profilePicture = response.url;
          this.toastr.info('Profile picture updated successfully');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to upload profile picture');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  removePicture(): void {
    this.loading = true;
    this.adminService.removeUserProfilePicture(this.data.userId)
    .subscribe({
      next: () => {
        this.profilePicture = 'assets/img/default-avatar.png';
        this.hasProfilePicture = false;
        this.toastr.info('Profile picture removed successfully');
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Failed to remove profile picture');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
