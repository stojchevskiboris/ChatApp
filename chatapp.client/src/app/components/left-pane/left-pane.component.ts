import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { interval, Subscription } from 'rxjs';
import { LastActiveModel } from '../../models/last-active-model';
import { ScrollDirection } from '../../models/enums/scroll-direction-enum';
import { RecentChatViewModel } from '../../models/recent-chat-view-model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.css'
})
export class LeftPaneComponent implements OnInit, OnDestroy {

  dialog = inject(MatDialog);
  @ViewChild('searchInput') searchInput: ElementRef;
  searchQuery: string = '';
  @Output() selectedChat = new EventEmitter<number>();
  @Input() startChat: any;
  @Input() updateActiveContact: number;
  @Input() newChatMessage: RecentChatViewModel;
  selectedChatId: number = null;

  prevScrollPosMessages = 0;
  prevScrollPosContacts = 0;
  canLoadMessagesSemaphore = true;
  canLoadContactsSemaphore = true;

  chatList: RecentChatViewModel[] = [];
  contactsList: UserViewModel[] = [];
  selectedTabIndex: number = 0;

  hasContactsLoaded: boolean = false;
  hasMessagesLoaded: boolean = false;
  updateLastActiveSubscription: Subscription;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getContacts();
    this.getRecentChats();
    this.updateLastActiveSubscription = interval(60000).subscribe(x => {
      this.updateContactsLastActive();
    });
  }

  ngOnDestroy() {
    this.updateLastActiveSubscription.unsubscribe();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let chatChange: SimpleChange = changes['startChat'];
    if (chatChange != undefined && !chatChange.firstChange) {
      this.selectedTabIndex = 0;
      this.searchInput.nativeElement.focus();
    }

    let activeContactChange: SimpleChange = changes['updateActiveContact'];
    if (activeContactChange != undefined && !activeContactChange.firstChange) {
      let contact = this.contactsList.find(c => c.id === activeContactChange.currentValue);
      if (contact) {
        contact.lastActive = new Date().toISOString();
        this.cdr.detectChanges();
      }
    }

    let recentMessageChange: SimpleChange = changes['newChatMessage'];
    if (recentMessageChange != undefined && !recentMessageChange.firstChange) {
      const existingChatIndex = this.chatList.findIndex(
        chat => chat.recipientId === this.newChatMessage.recipientId // recentMessageChange.currentValue.recipientId
      );

      if (existingChatIndex !== -1) {
        var chatToUpdate = this.chatList[existingChatIndex];
        chatToUpdate.content = this.newChatMessage.content;
        chatToUpdate.createdAt = this.newChatMessage.createdAt;
        chatToUpdate.isSentMessage = this.newChatMessage.isSentMessage;
        chatToUpdate.mediaType = this.newChatMessage.mediaType;
        chatToUpdate.hasMedia = this.newChatMessage.hasMedia;
        if (this.selectedChatId === this.newChatMessage.recipientId) {
          chatToUpdate.isSeen = true;
        } else {
          chatToUpdate.isSeen = false;
        }
      } else {
        // Fetch recipient info and add new chat
        this.userService.getUserDetails(this.newChatMessage.recipientId)
          .subscribe(user => {
            const newChat = {
              ...this.newChatMessage,
              recipientFirstName: user.firstName,
              recipientLastName: user.lastName,
              recipientProfilePicture: user.profilePicture
            };
            this.chatList.unshift(newChat);
          });
      }
      this.sortChats();
      this.cdr.detectChanges();
    }
  }

  // #region ScrollBar Events
  onScrollMessages(event: any): void {
    const scrollPosition = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    const scrollDirection = scrollPosition > this.prevScrollPosMessages ? ScrollDirection.Down : ScrollDirection.Up;
    this.prevScrollPosMessages = scrollPosition;

    const threshold = 10; // Threshold for bottom and top detection

    if (scrollDirection === ScrollDirection.Down && scrollHeight - scrollPosition <= clientHeight + threshold) {
      this.onBottomReached(1);
    }

    if (scrollDirection === ScrollDirection.Up && scrollPosition <= threshold) {
      this.onTopReached(1);
    }
  }

  onScrollContacts(event: any): void {
    const scrollPosition = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    const scrollDirection = scrollPosition > this.prevScrollPosContacts ? ScrollDirection.Down : ScrollDirection.Up;
    this.prevScrollPosContacts = scrollPosition;

    console.log('Contacts Scroll Direction:', scrollDirection);

    const threshold = 10; // Threshold for bottom and top detection

    if (scrollDirection === ScrollDirection.Down && scrollHeight - scrollPosition <= clientHeight + threshold) {
      console.log('Bottom reached in contacts!');
      this.onBottomReached(2);
    }

    if (scrollDirection === ScrollDirection.Up && scrollPosition <= threshold) {
      console.log('Top reached in contacts!');
      this.onTopReached(2);
    }
  }

  onBottomReached(tab: number): void {
    if (tab === 1 && this.canLoadMessagesSemaphore) {
      this.canLoadMessagesSemaphore = false;
      setTimeout(() => {
        this.canLoadMessagesSemaphore = true;
      }, 500)
      // TODO: this should fetch messages
      console.log('Reached the bottom of the message list');
    } else if (tab === 2 && this.canLoadContactsSemaphore) {
      this.canLoadContactsSemaphore = false;
      setTimeout(() => {
        this.canLoadContactsSemaphore = true;
      }, 500)
      // TODO: this should fetch contacts
      console.log('Reached the bottom of the contact list');
    }
  }

  onTopReached(tab: number): void {
    if (tab === 1) {
      console.log('Reached the top of the message list');
    } else if (tab === 2) {
      console.log('Reached the top of the contact list');
    }
  }
  // #endregion

  // #region MatTab Selected
  // ngAfterViewInit(): void {
  //   this.changeBackgroundColor();

  // }
  // changeActiveTab(): void {
  //   this.removePreviousActiveTabClass();
  //   this.changeBackgroundColor();
  // }

  // removePreviousActiveTabClass(): void {
  //   const previousActiveTab = document.getElementsByClassName('active-tab')[0];
  //   (previousActiveTab as HTMLElement).style.backgroundColor = 'unset';
  //   previousActiveTab.classList.remove('active-tab');
  // }

  // changeBackgroundColor(): void {
  //   const activeTab = document.getElementsByClassName('mdc-tab--active')[0];    
  //   (activeTab as HTMLElement).classList.add('active-tab');
  // }
  // #endregion

  openChatFromMessages(message: RecentChatViewModel) {
    message.isSeen = true;
    if (!message.isSentMessage) {
      this.messageService.setMessageSeen(message.id).subscribe(data => { });
    }
    this.openChat(message.recipientId);
  }

  openChat(recipientId: number) {
    this.selectedChat.emit(recipientId);
    this.selectedChatId = recipientId;
  }

  handleSelectedChat(event: number) {
    if (event == -1) {
      this.selectedChatId = null;
    }
    this.selectedChat.emit(event);
  }

  goToContactsTab() {
    this.selectedTabIndex = 1;
  }

  addContacts() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getContacts();
      console.log(`Dialog result: ${result}`);
    });

  }

  getRecentChats() {
    var setFlag: boolean = true;
    setTimeout(() => {
      if (setFlag) {
        this.hasMessagesLoaded = false;
      }
    }, 200);
    this.messageService.getRecentChats(this.searchQuery).subscribe({
      next: (model: RecentChatViewModel[]) => {
        setFlag = false;
        this.chatList = model;
        this.hasMessagesLoaded = true;
      },
      error: (err: any) => {
        setFlag = false;
        this.hasMessagesLoaded = true;
      },
      complete: () => {
        setFlag = false;
        this.hasMessagesLoaded = true;
      }
    })
  }

  getContacts() {
    var setFlag: boolean = true;
    setTimeout(() => {
      if (setFlag) {
        this.hasContactsLoaded = false;
      }
    }, 200);
    this.userService.getContacts().subscribe({
      next: (model: UserViewModel[]) => {
        setFlag = false;
        this.contactsList = model;
        this.hasContactsLoaded = true;
      },
      error: (err: any) => {
        setFlag = false;
        this.hasContactsLoaded = true;
      },
      complete: () => {
        setFlag = false;
        this.hasContactsLoaded = true;
      }
    })
  }

  updateContactsLastActive(): void {
    this.userService.updateContactsLastActive().subscribe({
      next: (response: LastActiveModel[]) => {
        const updatedList = this.contactsList.map(contact => {
          const updatedContact = response.find(c => c.id === contact.id);
          if (updatedContact) {
            return { ...contact, lastActive: updatedContact.lastActive };
          }
          return contact;
        });
        this.contactsList = [...updatedList];
      },
      error: (err: any) => {
        console.error('Error updating last active', err);
      }
    });
  }

  isContactActive(date: any): boolean {
    if (!date || isNaN(new Date(date).getTime())) {
      return false;
    }

    const now = new Date();
    const lastActiveDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));

    return diffInMinutes < 5;
  }

  getMediaType(fileType: string): string {
    return fileType?.startsWith('image/gif') ? 'a GIF' :
      fileType?.startsWith('image') ? 'an image' :
        fileType?.startsWith('video') ? 'a video' :
          fileType?.startsWith('audio') ? 'an audio' :
            fileType?.startsWith('application') ? 'a file' :
              'a message';
  }

  private sortChats(){
    this.chatList = this.chatList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}