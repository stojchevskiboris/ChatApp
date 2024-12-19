import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, tap } from 'rxjs';
import { AddContactModel } from '../models/add-contact-model';
import { RequestDetailsModel } from '../models/request-details-model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private dataService: DataService) {}

  private searchUsersEndpoint = '/Requests/SearchUsersToAdd';
  private getPendingRequestsEndpoint = '/Requests/GetPendingRequests';
  private getArchivedRequestsEndpoint = '/Requests/GetArchivedRequests';
  private getRequestsCountEndpoint = '/Requests/GetRequestsCount';
  private newRequestEndpoint = '/Requests/NewRequest';
  private cancelRequestEndpoint = '/Requests/CancelRequest';
  private acceptRequestEndpoint = '/Requests/AcceptRequest';
  private rejectRequestEndpoint = '/Requests/RejectRequest';

  
  searchUsersToAdd(query: string): Observable<AddContactModel[]> {
    return this.dataService
     .post<AddContactModel[]>(this.searchUsersEndpoint, { query: query })
     .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getPendingRequests(): Observable<RequestDetailsModel[]>{
    return this.dataService
     .get<RequestDetailsModel[]>(this.getPendingRequestsEndpoint)
     .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getArchivedRequests(): Observable<RequestDetailsModel[]>{
    return this.dataService
     .get<RequestDetailsModel[]>(this.getArchivedRequestsEndpoint)
     .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getRequestsCount(){
    return this.dataService
      .get<number>(this.getRequestsCountEndpoint)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  
  newRequest(userId: number){
    return this.dataService
      .post<boolean>(this.newRequestEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  cancelRequest(userId: number){
    return this.dataService
      .post<boolean>(this.cancelRequestEndpoint, { id: userId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  acceptRequest(requestId: number){
    return this.dataService
      .post<boolean>(this.acceptRequestEndpoint, { id: requestId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  rejectRequest(requestId: number){
    return this.dataService
      .post<boolean>(this.rejectRequestEndpoint, { id: requestId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

}
