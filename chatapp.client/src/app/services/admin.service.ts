import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserRoleViewModel } from '../models/user-role-view-model';
import { SqlResultModel } from '../models/sql-result-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private getCurrentUserRoleEndpoint = '/Admin/GetCurrentUserRole';
  private runSqlEndpoint = '/Users/RunSql';

  constructor(private dataService: DataService) {}

  getCurrentUserRole(): Observable<UserRoleViewModel>{
    return this.dataService
      .get<any>(this.getCurrentUserRoleEndpoint)
      .pipe(
        tap((response: UserRoleViewModel) => {
          return response;
        })
      );
  }

  executeSql(query): Observable<SqlResultModel>{
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
