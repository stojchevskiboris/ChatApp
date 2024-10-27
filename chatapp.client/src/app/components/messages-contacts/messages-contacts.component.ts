import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages-contacts',
  templateUrl: './messages-contacts.component.html',
  styleUrl: './messages-contacts.component.css'
})
export class MessagesContactsComponent implements OnInit {

  constructor() { }

  messagesList: any[] = [];
  contactsList: any[] = [];

  ngOnInit(): void {

    // test data
    this.testData();
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

    const now = new Date();

    // Case 1: Within the last 5 minutes
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 3 * 60 * 1000), // 3 minutes ago
      isSeen: false
    });

    // Case 2: 5 to 30 minutes ago
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      isSeen: false
    });

    // Case 3: Same day, more than 30 minutes ago
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      isSeen: true
    });

    // Case 4: Within the last 7 days
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isSeen: true
    });

    // Case 5: More than 7 days ago, within the same year
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      isSeen: true
    });

    // Case 6: Previous years
    this.messagesList.push({
      name: names[Math.floor(Math.random() * names.length)],
      recentMessage: messages[Math.floor(Math.random() * messages.length)],
      lastMessageSentAt: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
      isSeen: false
    });

    // Adding some extra random data
    for (let i = 6; i < 10; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      this.messagesList.push({
        name: randomName,
        recentMessage: randomMessage,
        lastMessageSentAt: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        isSeen: true
      });
    }

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getTime() - 3 * 60 * 1000) // 3 minutes ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    });

    this.contactsList.push({
      name: names[Math.floor(Math.random() * names.length)],
      lastActive: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), // 1 year ago
    });


  }
}
