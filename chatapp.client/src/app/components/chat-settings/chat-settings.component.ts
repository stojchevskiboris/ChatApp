import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
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
  @Input() newMediaMessage: MediaViewModel;
  recipient: UserViewModel = null;
  defaultAvatar = 'img/default-avatar.png';
  recipientProfilePicture: string = this.defaultAvatar;
  loading: boolean = false;
  showSearchResults: boolean = false;
  searchQuery: string = '';
  searchResults: MessageViewModel[] = [];
  loadingSearchResults: boolean = false;
  selectedMessageId: number;
  selectedMedia: MediaViewModel | null = null;
  loadingSharedMedia: boolean = true;
  sharedMedia: MediaViewModel[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setRecipient();
    this.getSharedMedia();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && !changes['recipientId'].firstChange) {
      this.setRecipient();
      this.searchResults = [];
      this.sharedMedia = [];
      this.getSharedMedia();
      this.showSearchResults = false;
      this.searchQuery = '';
      this.selectedMessageId = -1;
    }

    let mediaMessageChange: SimpleChange = changes['newMediaMessage'];
    if (mediaMessageChange != undefined
      && !mediaMessageChange.firstChange
      && mediaMessageChange.currentValue !== undefined) {
      this.sharedMedia.unshift(mediaMessageChange.currentValue)
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

  getSharedMedia() {
    this.loadingSharedMedia = true;
    this.messageService.getSharedMedia(this.recipientId).subscribe(
      (media: MediaViewModel[]) => {
        this.sharedMedia = media;
        this.loadingSharedMedia = false;
      },
      (error) => {
        console.error('Error retrieving shared media:', error);
        this.loadingSharedMedia = false;
      },
      () => {
        this.loadingSharedMedia = false;
      }
    );
  }

  searchMessages(): void {
    this.searchResults = [];
    if (!this.searchQuery.trim()) {
      return;
    }
    this.loadingSearchResults = true;
    this.messageService.searchMessages(this.recipientId, this.searchQuery).subscribe(
      (results: MessageViewModel[]) => {
        this.searchResults = results;
        this.loadingSearchResults = false;
        this.showSearchResults = true;
        this.scrollToBottom();
      },
      (error) => {
        this.loadingSearchResults = false;
        console.error('Error searching messages:', error);
      },
      () => {
        this.loadingSearchResults = false;
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
    }, 50);
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