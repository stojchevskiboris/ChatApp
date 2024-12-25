import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserViewModel } from '../../models/user-view-model';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required], // Add gender control
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
            this.userForm.patchValue(response);
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error loading user data:', error);
          this.loading = false;
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