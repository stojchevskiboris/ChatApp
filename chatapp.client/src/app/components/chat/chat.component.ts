import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '../../services/auth.service';
import { MessageViewModel } from '../../models/message-view-model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Input() recipientId: number | null = null;
  @Output() toggleChatSettings = new EventEmitter();

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  @ViewChild('messageInput') messageInput: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  currentUserId: number = 0;
  recipient: { firstName: string, lastName: string, isActive: boolean, lastActive: string, id: number } | null = null;
  messages: MessageViewModel[] = [];

  hasScrolledToBottom: boolean = false;

  newMessage: string = '';
  showGifSearch: boolean = false;
  isMediaSelected: boolean = false;
  selectedMedia: { file: File, preview: string, type: string }[] = [];
  maxFileSizeMB: number = 20; // Maximum file size limit in MB
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {
    this.currentUserId = +this.authService.getUserId();
  }

  ngOnInit(): void {
    this.setRecipient();
    this.generateTestData();
  }

  ngAfterViewInit(): void {
    this.inputFocus();
  }

  private inputFocus() {
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
      this.newMessage = '';
      this.messageInput.nativeElement.focus();
    }
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

  toggleGifSearch(): void {
    this.showGifSearch = !this.showGifSearch;
  }

  hideGifSearch() {
    this.showGifSearch = false;
  }

  onImageUploadClick() {
    this.fileInput.nativeElement.click()
    this.showGifSearch = false;
  }

  handleGifSelected(gifUrl: string): void {
    console.log('Selected GIF:', gifUrl);
  
    const gifMessage: MessageViewModel = {
      messageId: this.messages.length + 1,
      senderId: this.currentUserId,
      recipientId: this.recipient?.id || 0,
      content: gifUrl,
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

  containsGiphy(content): any {
    if(content){
      return content.toLowerCase().includes('giphy');
    }
    return false;
  }

  sendMessage(): void {
    event.preventDefault();
    // Text Message
    if (this.newMessage.trim()) {
      const textMessage: MessageViewModel = {
        messageId: this.messages.length + 1,
        senderId: this.currentUserId,
        recipientId: this.recipient?.id || 0,
        content: this.newMessage.trim(),
        hasMedia: false,
        isSeen: false,
        parentMessageId: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      this.messages.push(textMessage);
      this.newMessage = '';
    }

    // Media Message
    if (this.selectedMedia.length > 0) {
      this.selectedMedia.forEach((media, index) => {
        const mediaMessage: MessageViewModel = {
          messageId: this.messages.length + 1 + index,
          senderId: this.currentUserId,
          recipientId: this.recipient?.id || 0,
          content: media.preview,
          hasMedia: true,
          isSeen: false,
          parentMessageId: false,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };

        console.log('Sending media:', media);
        // Replace with actual upload logic
        this.messages.push(mediaMessage);
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

  setRecipient() {
    this.recipient = {
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      lastActive: new Date().toDateString(),
      id: this.recipientId
    };
  }

  scrollToBottom() {
    this.scrollable.scrollTo({ bottom: -500, duration: 300 })
  }

  toggleSettings() {
    this.showGifSearch = false;
    this.toggleChatSettings.emit()
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