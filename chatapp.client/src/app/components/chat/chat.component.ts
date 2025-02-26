import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '../../services/auth.service';
import { MessageViewModel } from '../../models/message-view-model';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { interval, Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { MediaMessageModel } from '../../models/media-message-model';
import { MessageMediaViewModel } from '../../models/message-media-view-model';
import { MediaViewModel } from '../../models/media-view-model';
import { MediaPreviewDialogComponent } from '../dialogs/media-preview-dialog/media-preview-dialog.component';
import { SignalRService } from '../../services/signalr.service';
import { RecentChatViewModel } from '../../models/recent-chat-view-model';
import { ScrollDirection } from '../../models/enums/scroll-direction-enum';
import { MessagesChatModel } from '../../models/messages-chat-model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {

  @Input() recipientId: number | null = null;
  @Input() searchedMessageId: number = -1;
  @Output() toggleChatSettings = new EventEmitter();
  @Output() newSentChatMessage = new EventEmitter<RecentChatViewModel>();

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  @ViewChild('messageInput') messageInput: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  currentUserId: number = 0;
  currentUser: UserViewModel;
  recipient: UserViewModel = null;
  messages: MessageViewModel[] = [];

  hasScrolledToBottom: boolean = false;
  canBlurSearchMessage: number = 0;
  defaultAvatar = 'img/default-avatar.png';
  newMessage: string = '';
  showGifSearch: boolean = false;
  isMediaSelected: boolean = false;
  selectedMedia: MediaMessageModel[] = [];
  maxFileSizeMB: number = 20; // Maximum file size limit in MB
  errorMessage: string | null = null;
  recipientProfilePicture: string = this.defaultAvatar;
  loading: boolean = false;
  hasFetchedMessages: boolean = false;
  setRecipientSubscription: Subscription;
  selectedMediaFromChat: MediaViewModel | null = null;
  sharedMedia: MediaViewModel[] = [];
  noMessages: boolean = false;
  noOlderMessages: boolean = false;
  oldestMessageId: number = 0;
  loadingOlderMessages = false;
  canLoadMessagesSemaphore = true;
  fetchingOlderMessages = false;
  prevScrollPosMessages = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private signalrService: SignalRService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.currentUserId = +this.authService.getUserId();
  }

  ngOnInit(): void {
    this.getCurrentUserDetails()
      .then(() => this.setRecipient())
      .then(() => this.getRecentMessages())
      .then(() => this.connectSignalR())
      .catch((error) => {
        console.error('Error in initialization sequence:', error);
      });

    this.setRecipientSubscription = interval(60000).subscribe(() => {
      this.setRecipient(false);
    });
  }

  getCurrentUserDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUserDetails()
        .subscribe({
          next: (response: UserViewModel) => {
            if (response) {
              this.currentUser = response;
              resolve();
            }
          },
          error: (error) => {
            console.error('Error loading user data:', error);
            reject(error);
          }
        });
    });
  }

  ngOnDestroy() {
    this.setRecipientSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.focusToInput();
  }

  ngAfterViewChecked() {
    if (!this.hasScrolledToBottom) {
      try {
        this.scrollToBottom();
        this.hasScrolledToBottom = true;
      } catch (e) {
        console.log(e);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && !changes['recipientId'].firstChange) {
      this.noMessages = false;
      this.emptyMessages();
      this.setRecipient();
      this.getRecentMessages();
      this.newMessage = '';
      this.focusToInput();
      this.searchedMessageId = -1;
      this.hasScrolledToBottom = false;
      this.noOlderMessages = false;
      this.loadingOlderMessages = false;
      this.canLoadMessagesSemaphore = true;
      this.fetchingOlderMessages = false;
    }

    this.cdr.detectChanges();

    if (changes['searchedMessageId'] && !changes['searchedMessageId'].firstChange) {
      this.searchMessage();
    }
  }
  emptyMessages() {
    this.messages = [];
  }

  getRecentMessages(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.messageService.getRecentMessages(this.recipientId).subscribe({
        next: (result: MessagesChatModel) => {
          var messages: MessageViewModel[] = result.messages;
          this.oldestMessageId = result.oldestMessageId;
          if (!messages || messages.length === 0) {
            this.noMessages = true;
          }
          this.messages = messages;
          this.sharedMedia = messages
            .filter(x => x.hasMedia)
            .map(msg => this.mapToMediaViewModel(msg));
          this.hasFetchedMessages = true;
          this.cdr.detectChanges();
          this.scrollToBottom();
          resolve();
        },
        error: (error: HttpErrorResponse) => {
          this.hasFetchedMessages = true;
          console.error('Error fetching messages:', error);
          this.scrollToBottom();
          reject(error);
        },
        complete: () => {
          this.hasFetchedMessages = true;
          this.scrollToBottom();
          resolve();
        }
      });
    });
  }

  connectSignalR(): Promise<void> {
    return new Promise((resolve) => {
      this.signalrService.getHubConnection()
        .on('ReceiveMessage', (userFromId: number, message: MessageViewModel) => {
          if (userFromId === this.recipientId) {
            this.messages.push(message);
            if (message.hasMedia) {
              const media = this.mapToMediaViewModel(message);
              this.sharedMedia.push(media);
            }
            this.cdr.detectChanges();
            this.scrollToBottom();
          }
        });
      resolve();
    });
  }

  handleMediaUpload(event: Event): void {
    var mediaToUpload = 0;
    const input = event.target as HTMLInputElement;
    this.errorMessage = null;
    if (input.files && input.files.length > 0) {
      this.isMediaSelected = true;
      this.newMessage = "";
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.size > this.maxFileSizeMB * 1024 * 1024) {
          this.errorMessage = `File ${file.name} exceeds the maximum allowed size of ${this.maxFileSizeMB} MB.`;
          continue; // Skip this file
        }
        mediaToUpload++;
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedMedia.push({
            file: file,
            preview: reader.result as string,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      }
    }
    else {
      this.isMediaSelected = false;
    }
    if (mediaToUpload == 0) {
      this.isMediaSelected = false;
    }
    mediaToUpload = 0;
  }

  removeMedia(index: number): void {
    this.selectedMedia.splice(index, 1);
    this.isMediaSelected = this.selectedMedia.length > 0;
    setTimeout(() => {
      this.focusToInput();
    }, 100);
  }

  onImageUploadClick() {
    this.fileInput.nativeElement.click()
    this.showGifSearch = false;
  }

  handleGifSelected(gifUrl: string): void {
    console.log('Selected GIF:', gifUrl);

    this.messageService.uploadGif(gifUrl).subscribe({
      next: (uploadResponse) => {
        if (uploadResponse.url) {
          const media: MessageMediaViewModel = {
            id: -5,
            messageId: -5,
            url: uploadResponse.url,
            fileType: uploadResponse.contentType,
            fileSize: uploadResponse.fileLength,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
          }
          const mediaMessage: MessageViewModel = {
            id: -5,
            senderId: this.currentUserId,
            recipientId: this.recipient?.id || 0,
            content: uploadResponse.url,
            type: 'image/gif',
            media: media,
            hasMedia: true,
            isSeen: false,
            parentMessageId: 0,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
          };

          console.log('Sending media message:', mediaMessage);

          this.emitNewSentMessage(mediaMessage);
          this.messages.push(mediaMessage);
          var item = this.mapToMediaViewModel(mediaMessage);
          this.sharedMedia.push(item);
          this.scrollToBottom(true);
          this.messageService.sendMessage(mediaMessage).subscribe({
            next: (response: boolean) => {
              this.signalrService.sendMessage(this.recipientId, mediaMessage).then(() => {
                console.log('Message sent successfully via SignalR');
              })
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
              // this.toastr.error('Failed to send media message');
            },
            complete: () => {
              this.loading = false;
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
        // this.toastr.error('Failed to upload media');
        this.loading = false;
      },
    });

    this.scrollToBottom();
    this.showGifSearch = false;
  }

  toggleGifSearch(): void {
    this.showGifSearch = !this.showGifSearch;
  }

  hideGifSearch() {
    this.showGifSearch = false;
  }

  sendMessage(): void {
    event.preventDefault();
    // Text Message
    if (this.newMessage.trim()) {
      const textMessage: MessageViewModel = {
        id: -5,
        senderId: this.currentUserId,
        recipientId: this.recipient?.id || 0,
        content: this.newMessage.trim(),
        hasMedia: false,
        type: 'text',
        media: null,
        isSeen: false,
        parentMessageId: 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      this.emitNewSentMessage(textMessage);
      this.messages.push(textMessage);
      this.scrollToBottom(true);
      this.newMessage = '';
      this.messageService.sendMessage(textMessage).subscribe({
        next: (response: boolean) => {
          this.signalrService.sendMessage(this.recipientId, textMessage).then(() => {
            console.log('Message sent successfully via SignalR');
          })
        },
        error: (err: HttpErrorResponse) => {
        },
        complete: () => {
        },
      })
    }

    // Media Message
    if (this.selectedMedia.length > 0) {
      this.selectedMedia.forEach((media, index) => {
        const formData = new FormData();
        formData.append('file', media.file);

        this.messageService.uploadMedia(formData).subscribe({
          next: (uploadResponse) => {
            if (uploadResponse.url) {
              const media: MessageMediaViewModel = {
                id: -5,
                messageId: -5,
                url: uploadResponse.url,
                fileType: uploadResponse.contentType,
                fileSize: uploadResponse.fileLength,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString()
              }
              const mediaMessage: MessageViewModel = {
                id: -5,
                senderId: this.currentUserId,
                recipientId: this.recipient?.id || 0,
                content: uploadResponse.url,
                type: media.fileType,
                media: media,
                hasMedia: true,
                isSeen: false,
                parentMessageId: 0,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
              };

              console.log('Sending media message:', mediaMessage);

              this.emitNewSentMessage(mediaMessage);
              this.messages.push(mediaMessage);
              var item = this.mapToMediaViewModel(mediaMessage);
              this.sharedMedia.push(item);

              this.scrollToBottom(true);
              this.messageService.sendMessage(mediaMessage).subscribe({
                next: (response: boolean) => {
                  this.signalrService.sendMessage(this.recipientId, mediaMessage).then(() => {
                    console.log('Message sent successfully via SignalR');
                  })
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err);
                  // this.toastr.error('Failed to send media message');
                },
                complete: () => {
                  if (index === this.selectedMedia.length - 1) {
                    this.loading = false;
                  }
                },
              });
            }
          },
          error: (err) => {
            console.log(err);
            // this.toastr.error('Failed to upload media');
            if (index === this.selectedMedia.length - 1) {
              this.loading = false;
            }
          },
        });
      });

      this.selectedMedia = [];
      this.isMediaSelected = false;
    }

    this.scrollToBottom();

    setTimeout(() => {
      this.focusToInput();
    }, 100);
  }

  setRecipient(withLoading: boolean = true): Promise<void> {
    if (withLoading) {
      this.loading = true;
    }
    return new Promise((resolve, reject) => {
      this.userService.getUserDetails(this.recipientId).subscribe({
        next: (model: UserViewModel) => {
          this.recipient = new UserViewModel();
          this.cdr.detectChanges();
          this.recipient = model;
          this.recipientProfilePicture = model.profilePicture || this.defaultAvatar;
          resolve();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error setting recipient:', err);
          this.loading = false;
          reject(err);
        },
        complete: () => {
          this.loading = false;
          resolve();
        }
      });
    });
  }

  scrollToBottom(forceScroll: boolean = false) {
    if (forceScroll || !this.fetchingOlderMessages){
      this.scrollable.scrollTo({ bottom: -500, duration: 300 })
    }
  }

  scrollToTop() {
    this.scrollable.scrollTo({ top: 0, duration: 300 })
  }

  searchMessage() {
    if (this.searchedMessageId) {
      const messageExists = this.messages.some(msg => msg.id === this.searchedMessageId);
      if (messageExists) {
        this.scrollable.scrollToElement('#searchTag', { top: -10, duration: 300 });
        this.canBlurSearchMessage++;
        setTimeout(() => {
          this.canBlurSearchMessage--;
          if (this.canBlurSearchMessage == 0) {
            this.searchedMessageId = -1;
          }
          this.cdr.detectChanges();
        }, 5000);
      } else {
        console.log('Message not found locally. Fetching from server...');
        // this.fetchMessages(this.searchedMessageId);
      }
    }
  }

  toggleSettings() {
    this.showGifSearch = false;
    this.toggleChatSettings.emit()
  }

  emitNewSentMessage(message: MessageViewModel): void {
    const newRecentChat: RecentChatViewModel = {
      id: message.id,
      recipientId: this.recipientId,
      recipientUsername: this.recipient?.username ?? '',
      recipientFirstName: this.recipient?.firstName ?? '',
      recipientLastName: this.recipient?.lastName ?? '',
      recipientProfilePicture: this.recipient?.profilePicture,
      content: message.content,
      hasMedia: message.hasMedia,
      mediaType: message.media?.fileType || '',
      isSeen: true,
      isSentMessage: true,
      parentMessageId: message.parentMessageId,
      createdAt: message.createdAt ? new Date(message.createdAt) : null,
      modifiedAt: message.modifiedAt ? new Date(message.modifiedAt) : null
    };
    this.newSentChatMessage.emit(newRecentChat);
  }

  containsGiphy(content): any {
    if (content) {
      return content.toLowerCase().includes('giphy');
    }
    return false;
  }

  isContactActive(lastActive: any): boolean {
    if (!lastActive || isNaN(new Date(lastActive).getTime())) {
      return false;
    }

    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));

    return diffInMinutes < 5;
  }


  isGif(fileType: string | undefined): boolean {
    return fileType === 'image/gif';
  }

  isImage(fileType: string | undefined): boolean {
    return fileType?.startsWith('image') && !this.isGif(fileType) ? true : false;
  }

  isVideo(fileType: string | undefined): boolean {
    return fileType?.startsWith('video') ?? false;
  }

  isAudio(fileType: string | undefined): boolean {
    return fileType?.startsWith('audio') ?? false;
  }

  isFile(fileType: string | undefined): boolean {
    return fileType?.startsWith('application') ?? false;
  }

  getFileName(url: string): string {
    return url.split('/').pop()?.split('?')[0] || 'Unknown File';
  }

  openMediaPreview(msg: MessageViewModel) {
    var isSent = msg.senderId == this.currentUserId;
    var media = new MediaViewModel;
    media.id = msg.id;
    media.url = msg.media!.url;
    media.fileType = msg.media!.fileType;
    media.fileSize = msg.media!.fileSize;
    media.sentById = isSent ? this.recipient.id : this.currentUser.id;
    media.sentByFirstName = isSent ? this.currentUser.firstName : this.recipient.firstName;
    media.sentByLastName = isSent ? this.currentUser.lastName : this.recipient.lastName;
    media.sentByUsername = isSent ? this.currentUser.username : this.recipient.username;
    media.sentToId = isSent ? this.currentUser.id : this.recipient.id;
    media.sentToFirstName = isSent ? this.recipient.firstName : this.currentUser.firstName;
    media.sentToLastName = isSent ? this.recipient.lastName : this.currentUser.lastName;
    media.sentToUsername = isSent ? this.recipient.username : this.currentUser.username;
    media.createdAt = new Date(msg.createdAt);
    media.modifiedAt = new Date(msg.modifiedAt);
    this.dialog.open(MediaPreviewDialogComponent, {
      data: { media, sharedMedia: this.sharedMedia },
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      autoFocus: false,
    });
  }

  closeMediaPreview() {
    this.dialog.closeAll();
  }

  navigateMedia(direction: number) {
    if (!this.selectedMediaFromChat) return;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMediaFromChat!.id
    );
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.sharedMedia.length) {
      this.selectedMediaFromChat = this.sharedMedia[newIndex];
    }
  }

  hasOlderMedia(): boolean {
    if (!this.selectedMediaFromChat) return false;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMediaFromChat!.id
    );
    return currentIndex > 0;
  }

  hasNewerMedia(): boolean {
    if (!this.selectedMediaFromChat) return false;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMediaFromChat!.id
    );
    return currentIndex < this.sharedMedia.length - 1;
  }


  private hasInitialized = false;

  onScrollMessages(event: any): void {
    const scrollPosition = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    const scrollDirection = scrollPosition > this.prevScrollPosMessages ? ScrollDirection.Down : ScrollDirection.Up;
    this.prevScrollPosMessages = scrollPosition;

    const threshold = 10; // Threshold for bottom and top detection
    if (!this.hasInitialized) {
      setTimeout(() => {
        this.hasInitialized = true; // Prevent fetch on the first scroll event
      }, 1000);
      return;
    }
    if (scrollDirection === ScrollDirection.Down && scrollHeight - scrollPosition <= clientHeight + threshold) {
      this.onBottomReached();
    }

    if (scrollDirection === ScrollDirection.Up && scrollPosition <= threshold) {
      this.onTopReached();
    }
  }

  onBottomReached(): void {
    if (this.canLoadMessagesSemaphore) {
      this.canLoadMessagesSemaphore = false;
      setTimeout(() => {
        this.canLoadMessagesSemaphore = true;
      }, 500)

      console.log('Reached the bottom of the message list');
    }
  }


  onTopReached(): void {
    if (this.canLoadMessagesSemaphore) {
      this.canLoadMessagesSemaphore = false;
      setTimeout(() => {
        this.canLoadMessagesSemaphore = true;
      }, 500)

      console.log('Reached the top of the message list');
      this.fetchOlderMessages();
    }
  }
  fetchOlderMessages(){
    this.loadingOlderMessages = true;
    this.fetchingOlderMessages = true;
    this.scrollable.scrollToElement('#oldestMessageTag', { top: 10, duration: 0 });
    // this.scrollToTop();
    if(this.oldestMessageId == -2){
      this.loadingOlderMessages = false;
      return;
    }

    this.messageService.fetchOlderMessages(this.oldestMessageId, this.recipientId).subscribe({
      next: (result: MessagesChatModel) => {
        var fetchedMessages: MessageViewModel[] = result.messages;
        this.oldestMessageId = result.oldestMessageId;
        if (!fetchedMessages || fetchedMessages.length === 0) {
          this.noOlderMessages = true;
        }
        this.messages.unshift(...fetchedMessages);
        var fetchedMedia = fetchedMessages
          .filter(x => x.hasMedia)
          .map(msg => this.mapToMediaViewModel(msg));
        this.sharedMedia.unshift(...fetchedMedia);
        setTimeout(() => {
          this.loadingOlderMessages = false;
        }, 1000);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.loadingOlderMessages = false;
        }, 1000);        
        console.error('Error fetching older messages:', error);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingOlderMessages = false;
        }, 1000);      
      }
    });
  }

  private focusToInput() {
    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private mapToMediaViewModel(msg: MessageViewModel) {
    var isSent = msg.senderId == this.currentUserId;
    var media = new MediaViewModel;
    media.id = msg.id;
    media.url = msg.media!.url;
    media.fileType = msg.media!.fileType;
    media.fileSize = msg.media!.fileSize;
    media.sentById = isSent ? this.recipient.id : this.currentUser.id;
    media.sentByFirstName = isSent ? this.currentUser.firstName : this.recipient.firstName;
    media.sentByLastName = isSent ? this.currentUser.lastName : this.recipient.lastName;
    media.sentByUsername = isSent ? this.currentUser.username : this.recipient.username;
    media.sentToId = isSent ? this.currentUser.id : this.recipient.id;
    media.sentToFirstName = isSent ? this.recipient.firstName : this.currentUser.firstName;
    media.sentToLastName = isSent ? this.recipient.lastName : this.currentUser.lastName;
    media.sentToUsername = isSent ? this.recipient.username : this.currentUser.username;
    media.createdAt = new Date(msg.createdAt);
    media.modifiedAt = new Date(msg.modifiedAt);
    return media;
  }
}