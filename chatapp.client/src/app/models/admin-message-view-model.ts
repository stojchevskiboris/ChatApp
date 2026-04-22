export class AdminMessageViewModel {
  id: number = 0;
  senderId: number = 0;
  senderUsername: string = '';
  recipientId: number = 0;
  content: string = '';
  hasMedia: boolean = false;
  isSeen: boolean = false;
  isDeleted: boolean = false;
  parentMessageId: number | null = null;
  createdAt: string = '';
  modifiedAt: string = '';
}
