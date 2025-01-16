import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaPreviewDialogComponent } from '../dialogs/media-preview-dialog/media-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageViewModel } from '../../models/message-view-model';
import { MessageService } from '../../services/message.service';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrl: './chat-settings.component.css'
})
export class ChatSettingsComponent {

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  @Input() recipientId: number | null = null;
  @Output() searchMessageId = new EventEmitter<number>();
  recipient: UserViewModel = null;
  defaultAvatar = 'img/default-avatar.png';
  recipientProfilePicture: string = this.defaultAvatar;
  loading: boolean = false;
  searchQuery: string = '';
  searchResults: MessageViewModel[] = [];
  selectedMessageId: number;
  selectedMedia: Media | null = null;
  sharedMedia: Media[] = [
    {
      id: 1,
      url: 'https://picsum.photos/id/1011/300/200',
      fileType: 'image/jpeg',
      fileSize: 1536,
      createdAt: new Date('2024-12-20T10:00:00'),
      modifiedAt: new Date('2024-12-20T10:10:00'),
    },
    {
      id: 2,
      url: 'https://picsum.photos/id/1012/300/200',
      fileType: 'image/jpeg',
      fileSize: 2048,
      createdAt: new Date('2024-12-21T14:30:00'),
      modifiedAt: new Date('2024-12-21T14:40:00'),
    },
    {
      id: 3,
      url: 'https://picsum.photos/id/1013/300/200',
      fileType: 'image/jpeg',
      fileSize: 1890,
      createdAt: new Date('2024-12-22T08:15:00'),
      modifiedAt: new Date('2024-12-22T08:20:00'),
    },
    {
      id: 4,
      url: 'https://picsum.photos/id/1014/300/200',
      fileType: 'image/jpeg',
      fileSize: 1496,
      createdAt: new Date('2024-12-23T11:00:00'),
      modifiedAt: new Date('2024-12-23T11:05:00'),
    },
    {
      id: 5,
      url: 'https://picsum.photos/id/1015/300/200',
      fileType: 'image/jpeg',
      fileSize: 2104,
      createdAt: new Date('2024-12-24T09:00:00'),
      modifiedAt: new Date('2024-12-24T09:10:00'),
    },
    {
      id: 6,
      url: 'https://picsum.photos/id/1016/300/200',
      fileType: 'image/jpeg',
      fileSize: 1784,
      createdAt: new Date('2024-12-25T15:00:00'),
      modifiedAt: new Date('2024-12-25T15:05:00'),
    },
    {
      id: 7,
      url: 'https://picsum.photos/id/1017/300/200',
      fileType: 'image/jpeg',
      fileSize: 1982,
      createdAt: new Date('2024-12-26T12:00:00'),
      modifiedAt: new Date('2024-12-26T12:05:00'),
    },
    {
      id: 8,
      url: 'https://picsum.photos/id/1018/300/200',
      fileType: 'image/jpeg',
      fileSize: 1536,
      createdAt: new Date('2024-12-27T18:30:00'),
      modifiedAt: new Date('2024-12-27T18:35:00'),
    },
    {
      id: 9,
      url: 'https://picsum.photos/id/1019/300/200',
      fileType: 'image/jpeg',
      fileSize: 2048,
      createdAt: new Date('2024-12-28T08:45:00'),
      modifiedAt: new Date('2024-12-28T08:50:00'),
    },
    {
      id: 10,
      url: 'https://picsum.photos/id/1020/300/200',
      fileType: 'image/jpeg',
      fileSize: 1890,
      createdAt: new Date('2024-12-29T07:00:00'),
      modifiedAt: new Date('2024-12-29T07:05:00'),
    },
    {
      id: 11,
      url: 'https://picsum.photos/id/1021/300/200',
      fileType: 'image/jpeg',
      fileSize: 1496,
      createdAt: new Date('2024-12-30T16:00:00'),
      modifiedAt: new Date('2024-12-30T16:10:00'),
    },
    {
      id: 12,
      url: 'https://picsum.photos/id/1022/300/200',
      fileType: 'image/jpeg',
      fileSize: 2104,
      createdAt: new Date('2024-12-31T11:00:00'),
      modifiedAt: new Date('2024-12-31T11:05:00'),
    },
  ];
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setRecipient();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && !changes['recipientId'].firstChange) {
      this.setRecipient();
    }
  }
  
  scrollToBottom() {
    this.scrollable.scrollTo({ bottom: -500, duration: 300 })
  }

  setRecipient(withLoading: boolean = true): void {
    if (withLoading) {
      this.loading = true;
    }
    this.userService.getUserDetails(this.recipientId).subscribe({
      next: (model: UserViewModel) => {
        this.recipient = new UserViewModel();
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

  searchMessages(): void {
    if (!this.searchQuery.trim()) {
      return; // Ignore empty searches
    }

    this.messageService.searchMessages(this.recipientId, this.searchQuery).subscribe(
      (results: MessageViewModel[]) => {
        this.searchResults = results;
        this.scrollToBottom();
      },
      (error) => {
        console.error('Error searching messages:', error);
      }, 
      () => {

      }
    );
  }

  onSelectSearchResult(messageId: number): void {
    console.log('Selected message ID:', messageId);
    this.searchMessageId.emit(-1);
    // this.cdr.detectChanges();
    setTimeout(() => {
      this.searchMessageId.emit(messageId);
      this.selectedMessageId = messageId;
    },50);
  }

  openMediaPreview(media: Media) {
    this.dialog.open(MediaPreviewDialogComponent, {
      data: { media, sharedMedia: this.sharedMedia },
      width: '700px',
      autoFocus: false,
    });
  }

  closeMediaPreview() {
    this.dialog.closeAll();
  }


  navigateMedia(direction: number) {
    if (!this.selectedMedia) return;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMedia!.id
    );
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.sharedMedia.length) {
      this.selectedMedia = this.sharedMedia[newIndex];
    }
  }

  hasOlderMedia(): boolean {
    if (!this.selectedMedia) return false;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMedia!.id
    );
    return currentIndex > 0;
  }

  hasNewerMedia(): boolean {
    if (!this.selectedMedia) return false;
    const currentIndex = this.sharedMedia.findIndex(
      (m) => m.id === this.selectedMedia!.id
    );
    return currentIndex < this.sharedMedia.length - 1;
  }

}

interface Media {
  id: number;
  url: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  modifiedAt: Date;
}
