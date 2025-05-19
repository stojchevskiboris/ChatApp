import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMediaDialogComponent } from '../dialogs/remove-media-dialog/remove-media-dialog.component';
import { EncryptDecryptService } from '../../services/encrypt-decrypt.service';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrl: './account-settings.component.css',
    standalone: false
})
export class AccountSettingsComponent {

  dialog = inject(MatDialog);
  loading: boolean = false;
  profilePicture: string = 'assets/img/default-avatar.png'; // Placeholder image path
  hasProfilePicture: boolean = false;
  userForm: FormGroup;
  passwordForm: FormGroup;
  minDate: Date = new Date(new Date().setFullYear(1900));
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 10));
  gender: number;
  passwordFormNotEmpty: boolean = true;

  constructor(
    private userService: UserService,
    private encryptDecryptService: EncryptDecryptService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [{ value: '', disabled: true }],
      dateOfBirth: ['', Validators.required],
      phone: [''],
      gender: [0, Validators.required],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getCurrentUserDetails()
      .subscribe(
        (response: UserViewModel) => {
          if (response) {
            this.userForm.patchValue({
              ...response,
              gender: response.gender.toString()
            });
            if (response.profilePicture) {
              this.profilePicture = response.profilePicture;
              this.hasProfilePicture = true;
            }
          }
          this.loading = false;
        },
        (error) => {
          // console.error('Error loading user data:', error);
          this.loading = false;
          this.toastr.warning('An unexpected error has occurred');
        },
        () => {
          this.loading = false;
        }
      );
  }

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

    this.userService.uploadProfilePicture(formData).subscribe({
      next: (response) => {
        if (response.url) {
          this.hasProfilePicture = true;
          this.profilePicture = response.url;
          this.toastr.info('Profile picture updated successfully');
        }
      },
      error: (err) => {
        // console.log(err)
        this.toastr.error('Failed to upload profile picture');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  removePicture(): void {
    const dialogRef = this.dialog.open(RemoveMediaDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.userService.removeProfilePicture().subscribe({
          next: () => {
            this.profilePicture = 'assets/img/default-avatar.png'; // Set to the default placeholder
            this.hasProfilePicture = false;
            this.toastr.info('Profile picture removed successfully');
          },
          error: (err) => {
            this.loading = false;
            // console.error('Error removing profile picture:', err);
            this.toastr.error('Failed to remove profile picture');
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }

  updateUserDetails(): void {
    if (this.userForm.valid) {
      const dateOfBirth = this.userForm.value.dateOfBirth;
      this.userForm.controls['dateOfBirth'].setValue(this.datePipe.transform(dateOfBirth, 'yyyy-MM-dd'));

      this.userService.updateUser(this.userForm.value)
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.toastr.info('Succesfully updated account');
              this.loadUserData();
            } else {
              this.toastr.warning('An unexpected error has occurred');
            }
            this.loading = false;
          },
          error: () => {
            this.toastr.warning('An unexpected error has occurred');
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });

      // console.log('Updating user details:', this.userForm.value);
    }
  }

  changePassword(): void {
    if (this.passwordFormHasData) {
      const rawOldPassword = this.passwordForm.controls['oldPassword'].value;
      const encryptedOldPassword = this.encryptDecryptService.encryptUsingAES256(this.passwordForm.controls['oldPassword'].value);
      const rawNewPassword = this.passwordForm.controls['newPassword'].value;
      const encryptedNewPassword = this.encryptDecryptService.encryptUsingAES256(this.passwordForm.controls['newPassword'].value);
      const rawConfirmPassword = this.passwordForm.controls['confirmPassword'].value;
      const encryptedConfirmPassword = this.encryptDecryptService.encryptUsingAES256(this.passwordForm.controls['confirmPassword'].value);
      this.passwordForm.controls['oldPassword'].setValue(encryptedOldPassword);
      this.passwordForm.controls['newPassword'].setValue(encryptedNewPassword);
      this.passwordForm.controls['confirmPassword'].setValue(encryptedConfirmPassword);
      this.userService.changePassword(this.passwordForm.value)
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.toastr.info('Succesfully changed password');
              this.passwordForm.reset();
              this.setClear()
            } else {
              this.toastr.warning('An unexpected error has occurred');
            }
            this.loading = false;
          },
          error: () => {
            this.toastr.warning('An unexpected error has occurred');
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      this.passwordForm.controls['oldPassword'].setValue(rawOldPassword);
      this.passwordForm.controls['newPassword'].setValue(rawNewPassword);
      this.passwordForm.controls['confirmPassword'].setValue(rawConfirmPassword);

    }
  }

  onPwFormChange() {
    var isFormClear = this.isPasswordFormClear();

    if (isFormClear) {
      this.passwordFormNotEmpty = false;
      this.setClear();
    } else {
      this.passwordFormNotEmpty = true;
      this.passwordForm.setValidators(this.passwordMatchValidator);
    }
  }

  setClear() {
    Object.keys(this.passwordForm.controls).forEach((controlName) => {
      const control = this.passwordForm.controls[controlName];
      if (control.errors) {
        control.setErrors(null);
      }
    });
  }

  passwordFormHasData(): boolean {
    var isFormClear = true;
    Object.keys(this.passwordForm.controls).forEach((controlName) => {
      const control = this.passwordForm.controls[controlName];
      if (control.value != null && control.value != undefined && control.value != "") {
        isFormClear = false;
      }
    });

    return !isFormClear;
  }

  isPasswordFormClear(): boolean {
    return this.passwordForm.get('oldPassword')?.value === ''
      && this.passwordForm.get('newPassword')?.value === ''
      && this.passwordForm.get('confirmPassword')?.value === '';
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

} 