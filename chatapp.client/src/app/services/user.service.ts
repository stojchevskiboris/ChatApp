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
}
