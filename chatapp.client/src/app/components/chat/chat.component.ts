import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MessageViewModel } from '../../models/message-view-model';
import { AuthService } from '../../services/auth.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Input() recipientId: number | null = null;
  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  @ViewChild('messageInput') messageInput: any;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  currentUserId: number = 0;
  recipient: { firstName: string, lastName: string, isActive: boolean, lastActive: string, id: number } | null = null;
  messages: MessageViewModel[] = [];
  newMessage: string = '';
  hasScrolledToBottom: boolean = false;

  constructor(private authService: AuthService) {
    this.currentUserId = +this.authService.getUserId();
  }

  ngOnInit(): void {
    this.setRecipient();
    this.generateTestData();
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
      this.setRecipient();
      this.generateTestData();
      this.scrollToBottom();
    }
  }

  sendMessage() {
    event.preventDefault();
    if (this.newMessage.trim()) {
      const message: MessageViewModel = {
        messageId: this.messages.length + 1,
        senderId: this.currentUserId,
        recipientId: this.recipient?.id || 3,
        content: this.newMessage.trim(),
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };
      this.messages.push(message);
      this.newMessage = '';
      this.scrollToBottom();
    }
    this.messageInput.nativeElement.focus();
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

  scrollToBottom() {
    this.scrollable.scrollTo({ bottom: -500, duration: 300 })
  }

  generateTestData() {
    this.messages = [
      {
        messageId: 1,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Hey! How are you?',
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
        content: 'I am good, thanks! And you?',
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
        content: 'I’m doing well! Just working on a project.',
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
        content: 'That sounds interesting! What project?',
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
        content: 'It’s a chat application.',
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
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 7,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 8,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 9,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 10,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 11,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 12,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 13,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 14,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 15,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 16,
        senderId: this.recipientId,
        recipientId: this.currentUserId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
      {
        messageId: 17,
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: 'Nice! I’d love to see it when it’s done.',
        hasMedia: false,
        isSeen: true,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }
    ];
  }
}