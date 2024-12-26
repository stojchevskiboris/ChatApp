import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserEndpoint = '/Users/GetUserById';
  private getContactsEndpoint = '/Users/GetContacts';
  private removeContactEndpoint = '/Users/RemoveContact';
  private updateUserEndpoint = '/Users/UpdateUser';

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
}
