import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.css'
})
export class LeftPaneComponent {

  constructor() { }

  @ViewChild('searchInput') searchInput: ElementRef;
  @Output() selectedChat = new EventEmitter<number>();
  @Input() startChat: any;
  selectedChatId: number = null;
  messagesList: any[] = [];
  contactsList: any[] = [];
  selectedTabIndex: number = 0;

  ngOnInit(): void {
    // test data
    this.testData();
  }

  ngAfterViewInit(): void {
    this.changeBackgroundColor();
    
  }
  changeActiveTab(): void {
    this.removePreviousActiveTabClass();
    this.changeBackgroundColor();
  }

  removePreviousActiveTabClass(): void {
    const previousActiveTab = document.getElementsByClassName('active-tab')[0];
    (previousActiveTab as HTMLElement).style.backgroundColor = 'unset';
    previousActiveTab.classList.remove('active-tab');
  }

  changeBackgroundColor(): void {
    const activeTab = document.getElementsByClassName('mdc-tab--active')[0];    
    (activeTab as HTMLElement).classList.add('active-tab');
  }

  isLessThan5min(date: any): boolean {
    if (!date || isNaN(new Date(date).getTime())) {
      return false;
    }

    const now = new Date();
    const lastActiveDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));

    return diffInMinutes < 5;
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

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes['startChat']; 
    if(!change.firstChange/* && change.previousValue != undefined && change.previousValue != change.currentValue*/){
      this.selectedTabIndex = 0;
      this.searchInput.nativeElement.focus();
    }
}

  goToContactsTab() {
    this.selectedTabIndex = 1;
  }

  addNewContactDialog() {
    throw new Error('Method not implemented.');
  }

  testData() {
    const names = [
      'Alice Foden', 'Bob Maguire', 'Charlie Scott', 'Diana Frank',
      'Edward Snowden', 'Fiona Isaac', 'Grace Foden', 'Chris Allen',
      'Bryan Green', 'George Allen'
    ];

    const messages = [
      'Just checking in!', 'Can we reschedule our meeting?',
      'Don’t forget to send the report.', 'Looking forward to our next chat.',
      'Do you have time to talk?', 'I found that article you might like.',
      'Let’s catch up soon!', 'How was your weekend?',
      'Happy to help with your project.', 'Are you free for lunch tomorrow?'
    ];
    var j: number = 1;

    const now = new Date();

    // Case 1: Within the last 5 minutes
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 3 * 60 * 1000), // 3 minutes ago
      isSeen: false,
      recipientId: j++
    });

    // Case 2: 5 to 30 minutes ago
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      isSeen: false,
      recipientId: j++
    });

    // Case 3: Same day, more than 30 minutes ago
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      isSeen: true,
      recipientId: j++
    });

    // Case 4: Within the last 7 days
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isSeen: true,
      recipientId: j++
    });

    // Case 5: More than 7 days ago, within the same year
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      isSeen: true,
      recipientId: j++
    });

    // Case 6: Previous years
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
      isSeen: false,
      recipientId: j++
    });

    // Adding some extra random data
    for (let i = 6; i < 20; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      this.messagesList.push({
        name: randomName,
        recentMessage: randomMessage,
        lastMessageSentAt: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        isSeen: true,
        recipientId: j++
      });
    }

    j = 1;

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getTime() - 3 * 60 * 1000) // 3 minutes ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recipientId: j++,
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });
  }
}