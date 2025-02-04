import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaPreviewDialogComponent } from '../dialogs/media-preview-dialog/media-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageViewModel } from '../../models/message-view-model';
import { MessageService } from '../../services/message.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { MediaViewModel } from '../../models/media-view-model';

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
  showSearchResults: boolean = false;
  searchQuery: string = '';
  searchResults: MessageViewModel[] = [];
  selectedMessageId: number;
  selectedMedia: MediaViewModel | null = null;
  sharedMedia: MediaViewModel[] = [
    {
      id: 1,
      url: 'https://picsum.photos/id/1011/300/200',
      fileType: 'image/jpeg',
      fileSize: 1536,
      sentByFirstName: 'Boris',
      sentByLastName: 'Stojchevski',
      sentById: 2,
      sentByUsername: 'boriss',
      sentToFirstName: 'Test',
      sentToLastName: 'User',
      sentToId: 1,
      sentToUsername: 'admin',
      createdAt: new Date('2024-12-20T10:00:00'),
      modifiedAt: new Date('2024-12-20T10:10:00'),
    },
    {
      id: 2,
      url: 'https://picsum.photos/id/1012/300/200',
      fileType: 'image/jpeg',
      fileSize: 2048,
      sentByFirstName: 'Anna',
      sentByLastName: 'Smith',
      sentById: 3,
      sentByUsername: 'anna_s',
      sentToFirstName: 'John',
      sentToLastName: 'Doe',
      sentToId: 4,
      sentToUsername: 'johnd',
      createdAt: new Date('2024-12-21T14:30:00'),
      modifiedAt: new Date('2024-12-21T14:40:00'),
    },
    {
      id: 3,
      url: 'https://picsum.photos/id/1013/300/200',
      fileType: 'image/jpeg',
      fileSize: 1890,
      sentByFirstName: 'James',
      sentByLastName: 'Brown',
      sentById: 5,
      sentByUsername: 'jamesb',
      sentToFirstName: 'Sarah',
      sentToLastName: 'Johnson',
      sentToId: 6,
      sentToUsername: 'sarahj',
      createdAt: new Date('2024-12-22T08:15:00'),
      modifiedAt: new Date('2024-12-22T08:20:00'),
    },
    {
      id: 4,
      url: 'https://picsum.photos/id/1014/300/200',
      fileType: 'image/jpeg',
      fileSize: 1496,
      sentByFirstName: 'Michael',
      sentByLastName: 'Williams',
      sentById: 7,
      sentByUsername: 'michaelw',
      sentToFirstName: 'Emma',
      sentToLastName: 'Davis',
      sentToId: 8,
      sentToUsername: 'emmad',
      createdAt: new Date('2024-12-23T11:00:00'),
      modifiedAt: new Date('2024-12-23T11:05:00'),
    },
    {
      id: 5,
      url: 'https://picsum.photos/id/1015/300/200',
      fileType: 'image/jpeg',
      fileSize: 2104,
      sentByFirstName: 'David',
      sentByLastName: 'Miller',
      sentById: 9,
      sentByUsername: 'davidm',
      sentToFirstName: 'Olivia',
      sentToLastName: 'Garcia',
      sentToId: 10,
      sentToUsername: 'oliviag',
      createdAt: new Date('2024-12-24T09:00:00'),
      modifiedAt: new Date('2024-12-24T09:10:00'),
    },
    {
      id: 6,
      url: 'https://picsum.photos/id/1016/300/200',
      fileType: 'image/jpeg',
      fileSize: 1784,
      sentByFirstName: 'Sophia',
      sentByLastName: 'Martinez',
      sentById: 11,
      sentByUsername: 'sophiam',
      sentToFirstName: 'Liam',
      sentToLastName: 'Rodriguez',
      sentToId: 12,
      sentToUsername: 'liamr',
      createdAt: new Date('2024-12-25T15:00:00'),
      modifiedAt: new Date('2024-12-25T15:05:00'),
    },
    {
      id: 7,
      url: 'https://picsum.photos/id/1017/300/200',
      fileType: 'image/jpeg',
      fileSize: 1982,
      sentByFirstName: 'Isabella',
      sentByLastName: 'Hernandez',
      sentById: 13,
      sentByUsername: 'isabellah',
      sentToFirstName: 'Noah',
      sentToLastName: 'Lopez',
      sentToId: 14,
      sentToUsername: 'noahl',
      createdAt: new Date('2024-12-26T12:00:00'),
      modifiedAt: new Date('2024-12-26T12:05:00'),
    },
    {
      id: 8,
      url: 'https://picsum.photos/id/1018/300/200',
      fileType: 'image/jpeg',
      fileSize: 1536,
      sentByFirstName: 'Lucas',
      sentByLastName: 'Gonzalez',
      sentById: 15,
      sentByUsername: 'lucasg',
      sentToFirstName: 'Mia',
      sentToLastName: 'Wilson',
      sentToId: 16,
      sentToUsername: 'miaw',
      createdAt: new Date('2024-12-27T18:30:00'),
      modifiedAt: new Date('2024-12-27T18:35:00'),
    },
    {
      id: 9,
      url: 'https://picsum.photos/id/1019/300/200',
      fileType: 'image/jpeg',
      fileSize: 2048,
      sentByFirstName: 'Charlotte',
      sentByLastName: 'Anderson',
      sentById: 17,
      sentByUsername: 'charlottea',
      sentToFirstName: 'Ethan',
      sentToLastName: 'Thomas',
      sentToId: 18,
      sentToUsername: 'ethant',
      createdAt: new Date('2024-12-28T08:45:00'),
      modifiedAt: new Date('2024-12-28T08:50:00'),
    },
    {
      id: 10,
      url: 'https://picsum.photos/id/1020/300/200',
      fileType: 'image/jpeg',
      fileSize: 1890,
      sentByFirstName: 'Amelia',
      sentByLastName: 'Moore',
      sentById: 19,
      sentByUsername: 'ameliam',
      sentToFirstName: 'Aiden',
      sentToLastName: 'Taylor',
      sentToId: 20,
      sentToUsername: 'aident',
      createdAt: new Date('2024-12-29T07:00:00'),
      modifiedAt: new Date('2024-12-29T07:05:00'),
    }
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
      this.searchResults = [];
      this.showSearchResults = false;
      this.searchQuery = '';
      this.selectedMessageId = -1;
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
        this.showSearchResults = true;
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

  openMediaPreview(media: MediaViewModel) {
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