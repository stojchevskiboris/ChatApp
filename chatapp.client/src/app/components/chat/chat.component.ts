import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageViewModel } from '../../models/message-view-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges {

  @Input() recipientId: number | null = null;
  currentUserId: number = 0;
  recipient: { firstName: string, lastName: string, isActive: boolean, lastActive: string, id: number } | null = null;
  messages: MessageViewModel[] = [];
  newMessage: string = '';

  constructor(private authService: AuthService) {
    this.currentUserId = +this.authService.getUserId();
  }

  ngOnInit(): void {
    this.generateTestData();
    this.setRecipient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && !changes['recipientId'].firstChange) {
      this.setRecipient();
      this.generateTestData();
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: MessageViewModel = {
        messageId: this.messages.length + 1,
        senderId: this.currentUserId,
        recipientId: this.recipient?.id || 3,
        conent: this.newMessage,
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };
      this.messages.push(message);
      this.newMessage = '';
      // Optionally scroll to bottom
    }
  }

  setRecipient() {
    this.recipient = {
      firstName: 'Donald',
      lastName: 'Trump',
      isActive: true,
      lastActive: new Date().toDateString(),
      id: this.recipientId
    };
  }


  generateTestData() {
    this.messages = [
      {
        messageId: 1,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        conent: 'Hey! How are you?',
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 2,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        conent: 'I am good, thanks! And you?',
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 3,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        conent: 'I’m doing well! Just working on a project.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 4,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        conent: 'That sounds interesting! What project?',
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 5,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        conent: 'It’s a chat application.',
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 6,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        conent: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }
    ];
  }
}