import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { MessageViewModel } from '../models/message-view-model';
import { Observable, tap } from 'rxjs';
import { RecentChatViewModel } from '../models/recent-chat-view-model';
import { MessagesChatModel } from '../models/messages-chat-model';
import { MediaViewModel } from '../models/media-view-model';

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
  private fetchOlderMessagesEndpoint = '/Messages/FetchOlderMessages';
  private fetchMessagesNewerThanMessageIdEndpoint = '/Messages/FetchMessagesNewerThanMessageId';
  private uploadMediaEndpoint = '/Messages/UploadMedia';
  private uploadGifEndpoint = '/Messages/UploadGif';
  private getSharedMediaEndpoint = '/Messages/GetSharedMedia';
  private deleteMessageEndpoint = '/Messages/DeleteMessage';

  searchMessages(recipientId: number, query: string): Observable<MessageViewModel[]> {
    return this.dataService
      .post<MessageViewModel[]>(this.searchMessagesEndpoint, { recipientId, query })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  sendMessage(model: MessageViewModel): Observable<number> {
    return this.dataService
      .post<number>(this.sendMessageEndpoint, model)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  uploadMedia(data: FormData): Observable<any> {
    return this.dataService
      .post<any>(this.uploadMediaEndpoint, data)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  uploadGif(gifUrl: string): Observable<any> {
    return this.dataService
      .post<any>(this.uploadGifEndpoint, { Query: gifUrl })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getRecentChats(searchInput: string): Observable<RecentChatViewModel[]> {
    return this.dataService
      .post<RecentChatViewModel[]>(this.getRecentChatsEndpoint, { Query: searchInput.trim() })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  setMessageSeen(messageId: number): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.setMessageSeenEndpoint, { Id: messageId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  deleteMessage(messageId: number): Observable<boolean> {
    return this.dataService
      .post<boolean>(this.deleteMessageEndpoint, { Id: messageId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getRecentMessages(recipientId: number): Observable<MessagesChatModel> {
    return this.dataService
      .post<MessagesChatModel>(this.getRecentMessagesEndpoint, { Id: recipientId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  fetchOlderMessages(oldestMessageId: number, recipientId: number): Observable<MessagesChatModel> {
    return this.dataService
      .post<MessagesChatModel>(this.fetchOlderMessagesEndpoint, { oldestMessageId, recipientId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  fetchMessagesNewerThanMessageId(oldestMessageId: number, recipientId: number): Observable<MessagesChatModel> {
    return this.dataService
      .post<MessagesChatModel>(this.fetchMessagesNewerThanMessageIdEndpoint, { oldestMessageId, recipientId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getSharedMedia(recipientId): Observable<MediaViewModel[]> {
    return this.dataService
      .post<MediaViewModel[]>(this.getSharedMediaEndpoint, { Id: recipientId })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}