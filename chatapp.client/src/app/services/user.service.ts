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
  private searchUsersEndpoint = '/Users/SearchUsersToAdd';
  private addUserEndpoint = '/Requests/NewRequestByUserId';
  private cancelRequestEndpoint = '/Requests/CancelRequest';

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

  searchUsersToAdd(currentUserId: number, query: string): Observable<AddContactModel[]> {
    return this.dataService
     .post<AddContactModel[]>(this.searchUsersEndpoint, { CurrentUserId: currentUserId, Query: query })
     .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  addUser(currentUserId: number, userId: number){
    return this.dataService
      .post<boolean>(this.addUserEndpoint, { userFromId: currentUserId, userToId: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  cancelRequest(currentUserId: number, userId: number){
    return this.dataService
      .post<boolean>(this.cancelRequestEndpoint, { userFromId: currentUserId, userToId: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  
}
