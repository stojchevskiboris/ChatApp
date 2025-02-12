import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { MessageViewModel } from '../models/message-view-model';
import { Observable, tap } from 'rxjs';
import { RecentChatViewModel } from '../models/recent-message-view-model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private dataService: DataService) { }

  private searchMessagesEndpoint = '/Messages/SearchMessages';
  private sendMessageEndpoint = '/Messages/SendMessage';
  private getRecentChatsEndpoint = '/Messages/GetRecentChats';
  private setMessageSeenEndpoint = '/Messages/SetMessageSeen';
  private getRecentMessagesEndpoint = '/Messages/GetRecentMessages';

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

  getRecentChats(searchInput: string): Observable<RecentChatViewModel[]> {
    return this.dataService
      .post<RecentChatViewModel[]>(this.getRecentChatsEndpoint, {Query: searchInput})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  setMessageSeen(messageId: number): Observable<boolean>{
    return this.dataService
      .post<boolean>(this.setMessageSeenEndpoint, {Id: messageId})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getRecentMessages(recipientId: number): Observable<MessageViewModel[]> {
    return this.dataService
      .post<MessageViewModel[]>(this.getRecentMessagesEndpoint, {Id: recipientId})
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
