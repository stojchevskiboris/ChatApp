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

  searchMessages(recipientId: number, query: string): Observable<MessageViewModel[]> {
    return this.dataService
      .post<MessageViewModel[]>(this.searchMessagesEndpoint, { recipientId, query })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
