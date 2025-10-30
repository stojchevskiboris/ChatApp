import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserRoleViewModel } from '../models/user-role-view-model';
import { SqlResultModel } from '../models/sql-result-model';
import { UserSearchModel } from '../models/user-search-model';
import { ChangePasswordAdminModel } from '../models/change-password-admin-model';
import { MessageSearchModel } from '../models/message-search-model';

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
  private exportUsersEndpoint = '/Admin/ExportUsers';

  private searchMessagesEndpoint = '/Admin/SearchMessages';
  private getMessageByIdEndpoint = '/Admin/GetMessageById';
  private saveOrUpdateMessageEndpoint = '/Admin/SaveOrUpdateMessage';
  private deleteMessageEndpoint = '/Admin/DeleteMessage';
  private exportMessagesEndpoint = '/Admin/ExportMessages';

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

  //#region Users
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

  changeUserPassword(model: ChangePasswordAdminModel) {
    return this.dataService
      .post<any>('/Admin/ChangeUserPassword', model)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  uploadUserProfilePicture(file: FormData): Observable<any> {
    return this.dataService
      .post<any>('/Admin/UploadUserProfilePicture', file)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  removeUserProfilePicture(userId: number): Observable<any> {
    return this.dataService
      .post<any>('/Admin/RemoveUserProfilePicture', { userId })
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
  exportUsers(searchModel: UserSearchModel): Observable<any> {
    return this.dataService
      .post<any>(this.exportUsersEndpoint, searchModel)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  //#endregion

  //#region Messages
  searchMessages(searchModel: MessageSearchModel): Observable<any> {
    return this.dataService
      .post<any>(this.searchMessagesEndpoint, searchModel )
      .pipe(
        tap((response) => {
          return response.data;
        })
      );
  }

  getMessageById(messageId: number): Observable<any> {
    return this.dataService
      .post<any>(this.getMessageByIdEndpoint, { id: messageId })
      .pipe(
        tap((response) => {
          return response.data;
        })
      );
  }

  saveOrUpdateMessage(message: any): Observable<any> {
    return this.dataService
      .post<any>(this.saveOrUpdateMessageEndpoint, message)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.dataService
      .post<any>(this.deleteMessageEndpoint, { id: messageId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  exportMessages(searchModel: MessageSearchModel): Observable<any> {
    return this.dataService
      .post<any>(this.exportMessagesEndpoint, searchModel)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  //#endregion


  //#region SQL
  executeSql(query): Observable<SqlResultModel> {
    return this.dataService
      .post<SqlResultModel>(this.runSqlEndpoint, { query })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  //#endregion

  getCurrentUser(): string {
    return localStorage.getItem('currentUser');
  }
}
