import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserRegisterModel } from '../../models/user-register-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router
  ) { }

  username: string = '';
  password: string = '';

  firstNameNew: string = '';
  lastNameNew: string = '';
  usernameNew: string = '';
  passwordNew: string = '';
  confirmPasswordNew: string = '';
  dateOfBirthNew: string = '';
  phoneNumberNew: string = '';

  errorMessage: string = '';
  isModelInvalid: boolean = false;
  container: any;

  ngOnInit() {
    this.container = this.el.nativeElement.querySelector(".container");
  }

  register() {
    this.isModelInvalid = false;
    if (this.usernameNew.trim() === '' || 
    this.passwordNew.trim() === '' || 
    this.confirmPasswordNew.trim() === '' || 
    this.firstNameNew.trim() === '' || 
    this.lastNameNew.trim() === '' || 
    this.dateOfBirthNew.trim() === '' || 
    this.phoneNumberNew.trim() === '') {
      this.errorMessage = 'All fields are required';
      return;
    }
    
    this.isModelInvalid = false;

    if (this.passwordNew !== this.confirmPasswordNew) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    var model = new UserRegisterModel();
    model.firstName = this.firstNameNew;
    model.lastName = this.lastNameNew;
    model.email = this.usernameNew;
    model.password =  this.passwordNew;
    model.dateOfBirth = this.dateOfBirthNew;
    model.phone = this.phoneNumberNew;

    this.authService.register(model).subscribe({
      next: (r) => {
        this.username = model.email;
        this.password = model.password;
        this.login();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = 'Something went wrong, please try again later';
        }
      },
    });
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (r) => {
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = 'Username or password is incorrect';
        } else {
          this.errorMessage = 'Something went wrong, please try again later';
        }
      },
    });
  }


  navToRegister() {
    this.errorMessage = null;
    this.isModelInvalid = false;
    this.container.classList.add('right-panel-active');
  }

  navToLogin() {
    this.errorMessage = null;
    this.isModelInvalid = false;
    this.container.classList.remove('right-panel-active');
  }
}
