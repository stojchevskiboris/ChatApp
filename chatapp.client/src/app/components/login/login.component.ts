import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserRegisterModel } from '../../models/user-register-model';
import { UserLoginModel } from '../../models/user-login-model';
import { ToastrService } from 'ngx-toastr';
import { EncryptDecryptService } from '../../services/encrypt-decrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginModel = new UserLoginModel();
  registerModel = new UserRegisterModel();

  loading: boolean = false;
  errorMessage: string = '';
  isModelInvalid: boolean = false;
  container: any;
  isSignUpPanelActive: boolean = false;
  minDate: string = new Date(new Date().setFullYear(1900))
    .toISOString()
    .split("T")[0];
  maxDate: string = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    .toISOString()
    .split("T")[0];

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private encryptDecryptService: EncryptDecryptService,
    private router: Router,
    private toastr: ToastrService
  ) { }


  ngOnInit() {
    this.container = this.el.nativeElement.querySelector(".container-login");
    this.authService.sessionLogin().subscribe({
      next: (response) => {
        if (response) {
          this.router.navigate(['/home']);
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  register() {
    this.isModelInvalid = false;
    if (
      this.registerModel.username.trim() === '' ||
      this.registerModel.password.trim() === '' ||
      this.registerModel.confirmPassword.trim() === '' ||
      this.registerModel.firstName.trim() === '' ||
      this.registerModel.lastName.trim() === '' ||
      this.registerModel.dateOfBirth.trim() === '' ||
      this.registerModel.phone.trim() === '' ||
      this.registerModel.gender == undefined
    ) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.isModelInvalid = false;

    if (this.registerModel.password !== this.registerModel.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.authService.checkUsernameAvailability(this.registerModel.username).subscribe({
      next: (isUsernameAvailable) => {        
        this.loading = false;
        if (!isUsernameAvailable) {
          this.errorMessage = 'Username is already taken';
          return;
        } else {
          this.createNewUser();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Something went wrong, please try again later';
        this.loading = false;
        this.toastr.warning('An unexpected error has occurred');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  createNewUser() {
    this.loading = true;
    const rawPassword = this.registerModel.password;
    const encryptedPassword = this.encryptDecryptService.encryptUsingAES256(this.registerModel.password);
    const rawConfirmPassword = this.registerModel.confirmPassword;
    const encryptedConfirmPassword = this.encryptDecryptService.encryptUsingAES256(this.registerModel.confirmPassword);
    this.registerModel.password = encryptedPassword;
    this.registerModel.confirmPassword = encryptedConfirmPassword;
    this.authService.register(this.registerModel).subscribe({
      next: (r) => {
        this.loginModel.username = this.registerModel.username;
        this.loginModel.password = rawPassword;
        this.login();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Something went wrong, please try again later';
        this.loading = false;
        this.toastr.warning('An unexpected error has occurred');
      },
      complete: () => {
        this.loading = false;
      }
    });
    this.registerModel.password = rawPassword;
    this.registerModel.confirmPassword = rawConfirmPassword;
  }

  login() {
    this.loading = true;
    const rawPassword = this.loginModel.password;
    const encryptedPassword = this.encryptDecryptService.encryptUsingAES256(this.loginModel.password);
    this.loginModel.password = encryptedPassword
    this.authService.login(this.loginModel).subscribe({
      next: (r) => {
        this.router.navigate(['/home']);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = 'Username or password is incorrect';
        } else {
          this.errorMessage = 'Something went wrong, please try again later';
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
    this.loginModel.password = rawPassword;
  }


  navToRegister() { // nav to sign up
    this.errorMessage = null;
    this.isModelInvalid = false;
    this.container.classList.add('right-panel-active');
    setTimeout(() => {
      this.isSignUpPanelActive = true;
    }, 400);
  }

  navToLogin() { // nav to sign in
    this.errorMessage = null;
    this.isModelInvalid = false;
    this.container.classList.remove('right-panel-active');
    setTimeout(() => {
      this.isSignUpPanelActive = false;
    }, 400);
  }
}
