import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '../../services/auth.service';
import { MessageViewModel } from '../../models/message-view-model';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { MediaMessageModel } from '../../models/media-message-model';
import { MessageMediaViewModel } from '../../models/message-media-view-model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {

  @Input() recipientId: number | null = null;
  @Input() searchedMessageId: number = -1;
  @Output() toggleChatSettings = new EventEmitter();

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  @ViewChild('messageInput') messageInput: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  currentUserId: number = 0;
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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = +this.authService.getUserId();
  }

  ngOnInit(): void {
    // this.generateTestData();
    this.getRecentMessages();
    this.setRecipient();
    this.setRecipientSubscription = interval(60000).subscribe(x => {
      this.setRecipient(false);
    });
  }

  ngOnDestroy() {
    this.setRecipientSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.messageInput.nativeElement.focus();
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
      this.emptyMessages();
      this.setRecipient();
      // this.generateTestData();
      this.getRecentMessages();
      this.newMessage = '';
      this.messageInput.nativeElement.focus();
      this.searchedMessageId = -1;
      this.hasScrolledToBottom = false;
    }

    this.cdr.detectChanges();

    if (changes['searchedMessageId'] && !changes['searchedMessageId'].firstChange) {
      this.searchMessage();
    }
  }
  emptyMessages() {
    this.messages = [];
  }

  getRecentMessages() {
    this.messageService.getRecentMessages(this.recipientId).subscribe(
      (messages: MessageViewModel[]) => {
        this.messages = messages;
        this.hasFetchedMessages = true;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      (error: HttpErrorResponse) => {
        this.hasFetchedMessages = true;
        console.error(error);
        this.scrollToBottom();
      },
      () => {
        this.hasFetchedMessages = true;
        this.scrollToBottom();
      }
    );
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
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);
  }

  onImageUploadClick() {
    this.fileInput.nativeElement.click()
    this.showGifSearch = false;
  }

  handleGifSelected(gifUrl: string): void {
    console.log('Selected GIF:', gifUrl);

    const media: MessageMediaViewModel = {
      id: -5,
      messageId: this.messages.length + 1,
      url: gifUrl,
      fileType: 'image/gif',
      fileSize: 0,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }

    const gifMessage: MessageViewModel = {
      id: this.messages.length + 1,
      senderId: this.currentUserId,
      recipientId: this.recipient?.id || 0,
      content: gifUrl,
      type: 'image/gif',
      media: media,
      hasMedia: true,
      isSeen: false,
      parentMessageId: false,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    this.messages.push(gifMessage);
    this.scrollToBottom();

    this.showGifSearch = false; // Close the GIF search overlay
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
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      this.messages.push(textMessage);
      this.newMessage = '';
      this.messageService.sendMessage(textMessage).subscribe({
        next: (response: boolean) => {
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
                content: uploadResponse.url,  // Use uploaded media URL
                type: media.fileType,  // Use uploaded media type
                media: media,
                hasMedia: true,
                isSeen: false,
                parentMessageId: false,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
              };

              console.log('Sending media message:', mediaMessage);

              this.messages.push(mediaMessage);
              this.messageService.sendMessage(mediaMessage).subscribe({
                next: (response: boolean) => {
                  // this.toastr.success('Media message sent successfully');
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
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);
  }

  setRecipient(withLoading: boolean = true): void {
    if (withLoading) {
      this.loading = true;
    }
    this.userService.getUserDetails(this.recipientId).subscribe({
      next: (model: UserViewModel) => {
        this.recipient = new UserViewModel();
        this.cdr.detectChanges();
        this.recipient = model
        if (model.profilePicture) {
          this.recipientProfilePicture = model.profilePicture;
        } else {
          this.recipientProfilePicture = this.defaultAvatar;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    })
  }

  scrollToBottom() {
    this.scrollable.scrollTo({ bottom: -500, duration: 300 })
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

  isImage(fileType: string | undefined): boolean {
    return fileType?.startsWith('image') ?? false;
  }
  
  isGif(fileType: string | undefined): boolean {
    return fileType === 'image/gif';
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

  // generateTestData() {
  //   this.messages = [
  //     {
  //       id: 1,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Hey! How are you?',
  //       hasMedia: false,
  //       isSeen: false,        
  //       type: 'text',
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 2,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'I am good, thanks! And you?',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: false,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 3,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'I’m doing well! Just working on a project.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 4,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'That sounds interesting! What project?',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: false,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 5,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'It’s a chat application.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: false,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 6,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 7,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 8,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 9,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 10,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 11,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 12,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 13,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 14,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 15,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 16,
  //       senderId: this.recipientId,
  //       recipientId: this.currentUserId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     },
  //     {
  //       id: 17,
  //       senderId: this.currentUserId,
  //       recipientId: this.recipientId,
  //       content: 'Nice! I’d love to see it when it’s done.',
  //       type: 'text',
  //       hasMedia: false,
  //       isSeen: true,
  //       parentMessageId: false,
  //       createdAt: new Date().toISOString(),
  //       modifiedAt: new Date().toISOString(),
  //     }
  //   ];
  // }
}