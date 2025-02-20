import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { SignalRService } from '../../services/signalr.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private userService: UserService,
    private signalrService: SignalRService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  isChatSelected: boolean = false;
  selectedChatRecipientId: number = 0;
  searchedMessageIdFromSettings: number = 0;
  userId: string = '';
  currentUser: UserViewModel = new UserViewModel();
  isChatSettingsEnabled: boolean = true;
  startChatEvent: boolean = false;
  lastActiveSubscription: Subscription;
  activeUserId: number = 0;

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getUserDetails();
    }
    this.connectSignalR();

    this.updateLastActive();
    this.lastActiveSubscription = interval(60000).subscribe(x => {
      this.updateLastActive();
    });
  }

  ngOnDestroy(){
    this.disconnectSignalR();
    this.lastActiveSubscription.unsubscribe();
  }

  connectSignalR() {
    this.signalrService.connect().then(() => {
      this.signalrService.getHubConnection()
        .on('Join', (userId: string, user:UserViewModel) => {
          if (user! && user.id != this.activeUserId){
            this.toastr.info(`${user.username} is active`, 'User Online', {
              timeOut: 2000,
              positionClass: 'toast-top-right',
              progressBar: true, 
              closeButton: false, 
            });
            this.activeUserId = user.id;
          }
        })
    })
  }

  disconnectSignalR() {
    this.signalrService.disconnect();
  }

  getUserDetails() {
    this.userService.getUserDetails(+this.userId).subscribe({
      next: (model: UserViewModel) => {
        this.currentUser = model
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  startChat() {
    this.startChatEvent = !this.startChatEvent;
  }

  handleSelectedChat(recipientId: number) {
    this.selectedChatRecipientId = recipientId;
    if (recipientId === -1 || recipientId == null) {
      this.isChatSelected = false;
    } else {
      this.isChatSelected = true;
    }
  }

  handleSearchedMessageId(messageId: number) {
    this.searchedMessageIdFromSettings = messageId;
  }

  toggleSettings(): void {
    this.isChatSettingsEnabled = !this.isChatSettingsEnabled;
  }

  updateLastActive() {
    this.userService.updateLastActive()
      .subscribe({
        next: () => console.log('Last active updated'),
        error: (err: HttpErrorResponse) => console.log('Error updating last active', err),
      });
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.currentUser = new UserViewModel();
  }
}