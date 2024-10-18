import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { UserRegisterModel } from '../models/user-register-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authEndpoint = '/Users/Authenticate';
  private registerEndpoint = '/Users/CreateUser';
  currentUser: UserViewModel;
  token: string = '';

  constructor(private dataService: DataService) { }

  register(model: UserRegisterModel): Observable<UserViewModel> {
    return this.dataService
      .post<any>(this.registerEndpoint, model )
      .pipe(
        tap((response: UserViewModel) => {
          return response;
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    return this.dataService
      .post<any>(this.authEndpoint, { username, password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id);
          this.token = response.token;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string {
    return localStorage.getItem('userId');
  }
}