import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { ChangePasswordModel } from '../models/change-password-model';
import { LastActiveModel } from '../models/last-active-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserEndpoint = '/Users/GetUserById';
  private getCurrentUserDetailsEndpoint = '/Users/GetCurrentUserDetails';
  private getContactsEndpoint = '/Users/GetContacts';
  private getContactIdsEndpoint = '/Users/GetContactIds';
  private removeContactEndpoint = '/Users/RemoveContact';
  private updateUserEndpoint = '/Users/UpdateUser';
  private changePasswordEndpoint = '/Users/ChangePassword';
  private uploadProfilePictureEndpoint = '/Users/UploadProfilePicture';
  private removeProfilePictureEndpoint = '/Users/RemoveProfilePicture';
  private updateLastActiveEndpoint = '/Users/UpdateLastActive';
  private updateContactsLastActiveEndpoint = '/Users/UpdateContactsLastActive';

  constructor(private dataService: DataService) {}

  getUserDetails(userId: number): Observable<UserViewModel> {
    return this.dataService
      .post<UserViewModel>(this.getUserEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getCurrentUserDetails(): Observable<UserViewModel>{
    return this.dataService
      .get<any>(this.getCurrentUserDetailsEndpoint)
      .pipe(
        tap((response: UserViewModel) => {
          return response;
        })
      );
  }

  getContacts(): Observable<UserViewModel[]> {
    return this.dataService
      .get<UserViewModel[]>(this.getContactsEndpoint)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getContactIds(): Observable<number[]> {
    return this.dataService
      .get<number[]>(this.getContactIdsEndpoint)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  
  removeContact(contactId: number): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.removeContactEndpoint, { id: contactId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  
  updateUser(model: UserViewModel): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.updateUserEndpoint, model)
      .pipe(
        tap((response) => {
          localStorage.setItem('currentUser', JSON.stringify(model));
          return response;
        })
      );
  }
  
  changePassword(model: ChangePasswordModel): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.changePasswordEndpoint, model)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  uploadProfilePicture(data: FormData): Observable<any> {
    return this.dataService
      .post<any>(this.uploadProfilePictureEndpoint, data)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  removeProfilePicture(): Observable<any> {
    return this.dataService
      .post<any>(this.removeProfilePictureEndpoint, {})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  updateLastActive(): Observable<any> {
    return this.dataService
      .post<any>(this.updateLastActiveEndpoint, {})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  updateContactsLastActive(): Observable<LastActiveModel[]> {
    return this.dataService
      .post<LastActiveModel[]>(this.updateContactsLastActiveEndpoint, {})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getCurrentUser(): string {
    return localStorage.getItem('currentUser');
  }
}
