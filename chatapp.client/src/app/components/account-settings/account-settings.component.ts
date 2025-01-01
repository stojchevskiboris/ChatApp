import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserViewModel } from '../../models/user-view-model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {

  loading: boolean = false;
  profilePicture: string = 'assets/img/default-avatar.png'; // Placeholder image path
  userForm: FormGroup;
  passwordForm: FormGroup;
  minDate: Date = null;
  maxDate: Date = new Date();
  gender: number;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
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
    this.authService.getCurrentUserDetails()
      .subscribe(
        (response: UserViewModel) => {
          if (response) {
            this.userForm.patchValue({
              ...response,
              gender: response.gender.toString()
            });
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error loading user data:', error);
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

  changePicture(file?: File): void {
    if (file) {
      // Logic to upload and update the profile picture
      console.log('Picture uploaded:', file);
    }
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

      console.log('Updating user details:', this.userForm.value);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      console.log('Changing password:', this.passwordForm.value);
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

}