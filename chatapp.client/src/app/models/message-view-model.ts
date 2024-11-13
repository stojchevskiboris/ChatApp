export class MessageViewModel {
    messageId: number = 0;
    senderId: number = 0;
    recipientId: number = 0;
    content: string = '';
    hasMedia: boolean = false;
    isSeen: boolean = false;
    parentMessageId: boolean = false;
    createdAt: string = '';
    modifiedAt: string = '';
}