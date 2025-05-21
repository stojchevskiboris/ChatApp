import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import { AuthService } from './auth.service';
import { MessageViewModel } from '../models/message-view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubUrl = environment.signalRUrl;
  hubConnection: HubConnection;
  currentUserId: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUserId = this.authService.getUserId();
    if (!this.currentUserId) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + `?userId=${this.currentUserId}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();
  }

  getHubConnection(): HubConnection {
    return this.hubConnection;
  }

  async connect(): Promise<void> {
    try {
      await this.hubConnection.start();
    } catch (err) {
    }
  }

  async disconnect(clearCache: boolean = true): Promise<void> {
    try {
      await this.hubConnection.stop();
      
      if (clearCache){
      localStorage.clear();
      window.location.reload();
      }
    } catch (err) {
    }
  }

  async sendMessage(toUserId: number, message: MessageViewModel): Promise<void> {
    try {
      await this.hubConnection.invoke('SendMessage', +this.currentUserId, toUserId, message);
    } catch (err) { }
  }

  async deleteMessage(toUserId: number, messageId: number): Promise<void> {
    try {
      await this.hubConnection.invoke('DeleteMessage', +this.currentUserId, toUserId, messageId);
    } catch (err) { }
  }

  async setMessageSeen(toUserId: number, messageId: number): Promise<void> {
    try {
      await this.hubConnection.invoke('SetMessageSeen', +this.currentUserId, toUserId, messageId);
    } catch (err) { }
  }

  async onTypingEvent(toUserId: number): Promise<void> {
    try {
      await this.hubConnection.invoke('Typing', +this.currentUserId, toUserId);
    } catch (err) {
    }
  }

  async newRequest(toUserId: number): Promise<void> {
    try {
      await this.hubConnection.invoke('NewRequest', toUserId);
    } catch (err) {
    }
  }
}