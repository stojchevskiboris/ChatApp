import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { SignalRService } from '../../services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { MessageViewModel } from '../../models/message-view-model';
import { RecentChatViewModel } from '../../models/recent-chat-view-model';
import { MediaViewModel } from '../../models/media-view-model';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  isChatSelected: boolean = false;
  selectedChatRecipientId: number = 0;
  searchedMessageIdFromSettings: number = 0;
  userId: string = '';
  currentUser: UserViewModel = new UserViewModel();
  isChatSettingsEnabled: boolean = true;
  startChatEvent: boolean = false;
  lastActiveSubscription: Subscription;
  activeUserId: number = 0;
  recievedChatMessage: RecentChatViewModel = null;
  recievedMediaMessage: MediaViewModel = null;

  showLeftPane: boolean = true;
  showChat: boolean = true;
  showChatSettings: boolean = true;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private userService: UserService,
    private signalrService: SignalRService,
    private toastr: ToastrService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 991px)');
    this._mobileQueryListener = () => cdr.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    if (this.mobileQuery.matches){
      this.showChat = false;
      this.showChatSettings = false;
      this.isChatSettingsEnabled = false;
    }
  }

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

  closeChatWindow() {
    this.showChatSettings = false;
    this.searchedMessageIdFromSettings = 0;
    this.isChatSettingsEnabled = false;

    this.showLeftPane = true;
    this.showChat = false;
    this.isChatSelected = false;
    this.selectedChatRecipientId = 0;
  }

  closeChatSettings(resetMessage: boolean = true) {
    this.showChat = true;
    this.showLeftPane = false;
    this.showChatSettings = false;
    this.isChatSettingsEnabled = false;
    if (resetMessage) {
      this.searchedMessageIdFromSettings = 0;
    }
  }

  ngOnDestroy() {
    this.disconnectSignalR();
    if (this.lastActiveSubscription) {
      this.lastActiveSubscription.unsubscribe();
    }
  }

  connectSignalR() {
    this.signalrService.connect().then(() => {
      var connection = this.signalrService.getHubConnection();
      connection.on('Join', (userId: string, user: UserViewModel) => {
        if (user! && user.id != this.activeUserId) {
          this.toastr.info(`${user.username} is active`, 'User Online', {
            timeOut: 2000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: false,
          });
          this.activeUserId = user.id;
        }
      })

      connection.on('ReceiveMessage', (userFromId: number, message: MessageViewModel) => {
        if (message != null) {
          const newRecentChat: RecentChatViewModel = {
            id: message.id,
            recipientId: userFromId,
            recipientUsername: '',
            recipientFirstName: '',
            recipientLastName: '',
            recipientProfilePicture: '',
            content: message.content,
            hasMedia: message.hasMedia,
            mediaType: message.media?.fileType || '',
            isSeen: message.isSeen,
            isSentMessage: false,
            parentMessageId: message.parentMessageId,
            createdAt: message.createdAt ? new Date(message.createdAt) : null,
            modifiedAt: message.modifiedAt ? new Date(message.modifiedAt) : null
          };
          this.recievedChatMessage = newRecentChat;
        }
      });

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
        // console.log(err);
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
      if (this.mobileQuery.matches) {
        this.showLeftPane = false;
        this.showChat = true;
        this.showChatSettings = false;
      }
    }
  }

  handleSearchedMessageId(messageId: number) {
    this.searchedMessageIdFromSettings = messageId;
    if(this.mobileQuery.matches && messageId != -1){
      this.closeChatSettings(false);
    }
  }

  toggleSettings(): void {
    this.isChatSettingsEnabled = !this.isChatSettingsEnabled;
    if (this.mobileQuery.matches){
      if (this.isChatSettingsEnabled){
        this.showChat = false;
        this.showChatSettings = true;
      }
    }
  }

  updateLeftPaneChats(sentMessageToUpdate: RecentChatViewModel): void {
    this.recievedChatMessage = sentMessageToUpdate;
  }

  updateChatSettings(sharedMediaToAdd: MediaViewModel): void {
    this.recievedMediaMessage = sharedMediaToAdd;
  }

  updateLastActive() {
    this.userService.updateLastActive()
      .subscribe({
        next: () => { },
        error: (err: HttpErrorResponse) => { }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.currentUser = new UserViewModel();
  }
}