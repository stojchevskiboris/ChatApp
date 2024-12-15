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
  private getContactsEndpoint = '/Users/GetContacts';


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
}
