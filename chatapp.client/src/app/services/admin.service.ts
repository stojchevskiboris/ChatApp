import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { UserRoleViewModel } from '../models/user-role-view-model';
import { SqlResultModel } from '../models/sql-result-model';
import { UserSearchModel } from '../models/user-search-model';
import { ChangePasswordAdminModel } from '../models/change-password-admin-model';
import { GroupSearchModel } from '../models/group-search-model';
import { SaveGroupModel } from '../models/save-group-model';
import { GroupUserSearchModel } from '../models/group-user-search-model';
import { SaveGroupUserModel } from '../models/save-group-user-model';
import { AdminMessageSearchModel } from '../models/admin-message-search-model';
import { MediaSearchModel } from '../models/media-search-model';
import { RecipientSearchModel } from '../models/recipient-search-model';
import { RequestSearchModel } from '../models/request-search-model';
import { UpdateRequestModel } from '../models/update-request-model';
import { RoleSearchModel } from '../models/role-search-model';
import { RoleUpdateModel } from '../models/role-update-model';

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

  //#endregion

  //#region Groups
  searchGroups(searchModel: GroupSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchGroups', searchModel).pipe(tap(r => r));
  }
  getGroupById(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/GetGroupById', { id }).pipe(tap(r => r));
  }
  saveOrUpdateGroup(model: SaveGroupModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SaveOrUpdateGroup', model).pipe(tap(r => r));
  }
  deleteGroup(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteGroup', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region GroupUsers
  searchGroupUsers(searchModel: GroupUserSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchGroupUsers', searchModel).pipe(tap(r => r));
  }
  getGroupUserById(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/GetGroupUserById', { id }).pipe(tap(r => r));
  }
  saveGroupUser(model: SaveGroupUserModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SaveGroupUser', model).pipe(tap(r => r));
  }
  deleteGroupUser(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteGroupUser', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region Messages
  searchMessages(searchModel: AdminMessageSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchMessages', searchModel).pipe(tap(r => r));
  }
  deleteMessage(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteMessage', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region Media
  searchMedia(searchModel: MediaSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchMedia', searchModel).pipe(tap(r => r));
  }
  deleteMedia(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteMedia', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region Recipients
  searchRecipients(searchModel: RecipientSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchRecipients', searchModel).pipe(tap(r => r));
  }
  deleteRecipient(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteRecipient', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region Requests
  searchRequests(searchModel: RequestSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchRequests', searchModel).pipe(tap(r => r));
  }
  updateRequest(model: UpdateRequestModel): Observable<any> {
    return this.dataService.post<any>('/Admin/UpdateRequest', model).pipe(tap(r => r));
  }
  deleteRequest(id: number): Observable<any> {
    return this.dataService.post<any>('/Admin/DeleteRequest', { id }).pipe(tap(r => r));
  }
  //#endregion

  //#region Roles
  searchRoles(searchModel: RoleSearchModel): Observable<any> {
    return this.dataService.post<any>('/Admin/SearchRoles', searchModel).pipe(tap(r => r));
  }
  updateUserRole(model: RoleUpdateModel): Observable<any> {
    return this.dataService.post<any>('/Admin/UpdateUserRole', model).pipe(tap(r => r));
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
