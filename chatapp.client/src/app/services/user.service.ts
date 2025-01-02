import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { ChangePasswordModel } from '../models/user-view-model copy';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserEndpoint = '/Users/GetUserById';
  private getCurrentUserDetailsEndpoint = '/Users/GetCurrentUserDetails';
  private getContactsEndpoint = '/Users/GetContacts';
  private removeContactEndpoint = '/Users/RemoveContact';
  private updateUserEndpoint = '/Users/UpdateUser';
  private changePasswordEndpoint = '/Users/ChangePassword';
  private uploadProfilePictureEndpoint = '/Users/UploadProfilePicture';

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
    return this.dataService.post<any>(this.uploadProfilePictureEndpoint , data)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
