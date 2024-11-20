import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { UserRegisterModel } from '../models/user-register-model';
import { UserLoginModel } from '../models/user-login-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginEndpoint = '/Users/Login';
  private sessionLoginEndpoint = '/Users/SessionLogin';
  private registerEndpoint = '/Users/Register';
  currentUser: string = '';
  token: string = '';

  constructor(private dataService: DataService) { }

  register(model: UserRegisterModel): Observable<UserViewModel> {
    return this.dataService
      .post<any>(this.registerEndpoint, model)
      .pipe(
        tap((response: UserViewModel) => {
          return response;
        })
      );
  }

  login(loginModel: UserLoginModel): Observable<any> {
    return this.dataService
      .post<any>(this.loginEndpoint, loginModel)
      .pipe(
        tap((response: any) => {
          this.currentUser = JSON.stringify(response);
          this.token = response.token;

          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('currentUser', this.currentUser);
        })
      );
  }

  sessionLogin(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }
    return this.dataService
      .post<any>(this.sessionLoginEndpoint, { token })
      .pipe(
        tap((response: any) => {
          this.currentUser = JSON.stringify(response);
          this.token = response.token;

          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('currentUser', this.currentUser);
        })
      );
  }

  logout() {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string {
    return localStorage.getItem('userId');
  }

  getCurrentUser(): string {
    return localStorage.getItem('currentUser');
  }
}