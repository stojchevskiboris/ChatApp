import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserRoleViewModel } from '../models/user-role-view-model';
import { SqlResultModel } from '../models/sql-result-model';
import { UserSearchModel } from '../models/user-search-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private getCurrentUserRoleEndpoint = '/Admin/GetCurrentUserRole';
  private runSqlEndpoint = '/Admin/RunSql';
  private searchUsersEndpoint = '/Admin/SearchUsers';
  private getUserByIdEndpoint = '/Admin/GetUserById';
  private saveOrUpdateUserEndpoint = '/Admin/SaveOrUpdateUser';
  private deleteUserEndpoint = '/Admin/DeleteUser';

  constructor(private dataService: DataService) { }

  getCurrentUserRole(): Observable<UserRoleViewModel> {
    return this.dataService
      .get<any>(this.getCurrentUserRoleEndpoint)
      .pipe(
        tap((response: UserRoleViewModel) => {
          return response;
        })
      );
  }

  searchUsers(searchModel: UserSearchModel): Observable<any> {
    return this.dataService
      .post<any>(this.searchUsersEndpoint, searchModel )
      .pipe(
        tap((response) => {
          return response.data;
        })
      );
  }

  getUserById(userId: number): Observable<any> {
    return this.dataService
      .post<any>(this.getUserByIdEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response.data;
        })
      );
  }

  saveOrUpdateUser(user: any): Observable<any> {
    return this.dataService
      .post<any>(this.saveOrUpdateUserEndpoint, user)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  deleteUser(userId: number): Observable<any> {
    return this.dataService
      .post<any>(this.deleteUserEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  executeSql(query): Observable<SqlResultModel> {
    return this.dataService
      .post<SqlResultModel>(this.runSqlEndpoint, { query })
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
