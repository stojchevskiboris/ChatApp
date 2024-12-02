import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserViewModel } from '../models/user-view-model';
import { AddContactModel } from '../models/add-contact-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserEndpoint = '/Users/GetUserById';
  private searchUsersEndpoint = '/Users/SearchUsers';
  private addUserEndpoint = '/Users/AddUserById';

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

  searchUsers(query: string): Observable<AddContactModel[]> {
    return this.dataService
     .post<AddContactModel[]>(this.searchUsersEndpoint, { query })
     .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  addUser(userId: number){
    return this.dataService
      .post<boolean>(this.addUserEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
