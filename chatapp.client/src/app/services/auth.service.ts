import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { UserRegisterModel } from '../models/user-register-model';
import { UserLoginModel } from '../models/user-login-model';
import { ToastrService } from 'ngx-toastr';
import { SignalRService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginEndpoint = '/Users/Login';
  private sessionLoginEndpoint = '/Users/SessionLogin';
  private registerEndpoint = '/Users/Register';
  private checkUsernameEndpoint = '/Users/CheckUsername';
  private getCurrentUserDetailsEndpoint = '/Users/GetCurrentUserDetails';
  currentUser: string = '';
  token: string = '';

  constructor(
    private dataService: DataService,
    private injector: Injector,
    private toastr: ToastrService
  ) { }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.checkUsernameEndpoint, {Query: username})
      .pipe(
        tap((response: boolean) => {
          return response;
        })
      );
  }


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
          this.setDetailedUser().subscribe();
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
          this.setDetailedUser().subscribe();
        })
      );
  }

  setDetailedUser(){
    return this.dataService
      .get<any>(this.getCurrentUserDetailsEndpoint)
      .pipe(
        tap((response: UserViewModel) => {
          if(response){
            this.currentUser = JSON.stringify(response);
            localStorage.setItem('currentUser', this.currentUser);
          }
        })
      );
  }

  logout(showInfo: boolean = true) {
    this.disconnectSignalR();

    localStorage.clear();

    if (showInfo){
      this.toastr.info('Succesfully signed out');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string {
    this.setDetailedUser().subscribe();
    return localStorage.getItem('userId');
  }

  private disconnectSignalR() {
    const signalrService = this.injector.get(SignalRService);
    signalrService.disconnect();
  }
}