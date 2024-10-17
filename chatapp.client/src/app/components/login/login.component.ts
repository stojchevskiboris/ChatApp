import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  ) {}

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  container: any;

  ngOnInit() {
    this.container = this.el.nativeElement.querySelector(".container");
  }
  
  register() {
    throw new Error('Method not implemented.');
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
    this.container.classList.add('right-panel-active');
  }

  navToLogin() {
    this.container.classList.remove('right-panel-active');
  }
}
