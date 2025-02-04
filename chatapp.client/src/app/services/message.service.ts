import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { MessageViewModel } from '../models/message-view-model';
import { Observable, tap } from 'rxjs';
import { RecentMessageViewModel } from '../models/recent-message-view-model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private dataService: DataService) { }

  private searchMessagesEndpoint = '/Messages/SearchMessages';
  private sendMessageEndpoint = '/Messages/SendMessage';
  private getRecentMessagesEndpoint = '/Messages/GetRecentMessages';
  private SetMessageSeenEndpoint = '/Messages/SetMessageSeen';

  searchMessages(recipientId: number, query: string): Observable<MessageViewModel[]> {
    return this.dataService
      .post<MessageViewModel[]>(this.searchMessagesEndpoint, { recipientId, query })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  sendMessage(model: MessageViewModel): Observable<boolean>{
    return this.dataService
      .post<boolean>(this.sendMessageEndpoint, model )
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getRecentMessages(searchInput: string): Observable<RecentMessageViewModel[]> {
    return this.dataService
      .post<RecentMessageViewModel[]>(this.getRecentMessagesEndpoint, {Query: searchInput})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  setMessageSeen(messageId: number): Observable<boolean>{
    return this.dataService
      .post<boolean>(this.SetMessageSeenEndpoint, {Id: messageId})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
