import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
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
  minDate: Date = new Date(new Date().setFullYear(1900));
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 10));
  gender: number;
  passwordFormNotEmpty: boolean = true;

  constructor(
    private userService: UserService,
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
    this.userService.getCurrentUserDetails()
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
    if (this.passwordFormHasData) {
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
    }
  }

  onPwFormChange() {
    var isFormClear = this.passwordFormHasData();
    

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

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

} 