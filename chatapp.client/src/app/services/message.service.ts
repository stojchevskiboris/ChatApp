import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { MessageViewModel } from '../models/message-view-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private dataService: DataService) { }

  private searchMessagesEndpoint = '/Messages/SearchMessages';
  private sendMessageEndpoint = '/Messages/SendMessage';

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
}
