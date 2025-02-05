import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { interval, Subscription } from 'rxjs';
import { LastActiveModel } from '../../models/last-active-model';
import { ScrollDirection } from '../../models/enums/scroll-direction-enum';
import { RecentChatViewModel } from '../../models/recent-message-view-model';
import { MessageViewModel } from '../../models/message-view-model';
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
  selectedChatId: number = null;

  prevScrollPosMessages = 0;
  prevScrollPosContacts = 0;
  canLoadMessagesSemaphore = true;
  canLoadContactsSemaphore = true;

  messagesList: RecentChatViewModel[] = [];
  contactsList: UserViewModel[] = [];
  selectedTabIndex: number = 0;

  hasContactsLoaded: boolean = false;
  hasMessagesLoaded: boolean = false;
  updateLastActiveSubscription: Subscription;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    // this.testData();
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
    let change: SimpleChange = changes['startChat'];
    if (!change.firstChange/* && change.previousValue != undefined && change.previousValue != change.currentValue*/) {
      this.selectedTabIndex = 0;
      this.searchInput.nativeElement.focus();
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
    this.messageService.setMessageSeen(message.id).subscribe(data => {});
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
        this.messagesList = model;
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

  testData() {
    const firstNames = [
      'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 
      'Fiona', 'Grace', 'Chris', 'Bryan', 'George'
    ];
  
    const lastNames = [
      'Foden', 'Maguire', 'Scott', 'Frank', 'Snowden', 
      'Isaac', 'Foden', 'Allen', 'Green', 'Allen'
    ];
  
    const messages = [
      'Just checking in!', 'Can we reschedule our meeting?', 
      'Don’t forget to send the report.', 'Looking forward to our next chat.', 
      'Do you have time to talk?', 'I found that article you might like.', 
      'Let’s catch up soon!', 'How was your weekend?', 
      'Happy to help with your project.', 'Are you free for lunch tomorrow?'
    ];
  
    let j: number = 1;
    const now = new Date();
  
    // Case 1: Within the last 5 minutes
    let message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getTime() - 3 * 60 * 1000); // 3 minutes ago
    message.isSeen = false;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Case 2: 5 to 30 minutes ago
    message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
    message.isSeen = false;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Case 3: Same day, more than 30 minutes ago
    message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago
    message.isSeen = true;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Case 4: Within the last 7 days
    message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    message.isSeen = true;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Case 5: More than 7 days ago, within the same year
    message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    message.isSeen = true;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Case 6: Previous years
    message = new RecentChatViewModel();
    message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    message.content = messages[Math.floor(Math.random() * messages.length)];
    message.modifiedAt = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // 1 year ago
    message.isSeen = false;
    message.recipientId = j++;
    this.messagesList.push(message);
  
    // Adding some extra random data
    for (let i = 6; i < 20; i++) {
      message = new RecentChatViewModel();
      message.recipientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      message.recipientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      message.content = messages[Math.floor(Math.random() * messages.length)];
      message.modifiedAt = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      message.isSeen = true;
      message.recipientId = j++;
      this.messagesList.push(message);
    }

    j = 1;

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getTime() - 3 * 60 * 1000) // 3 minutes ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });

    // this.contactsList.push({
    //   name: names[Math.floor(Math.random() * names.length)],
    //   recipientId: j++,
    //   lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    // });
  }
}