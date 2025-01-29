export class RecentMessageViewModel {
    id: number = 0;
    senderId: number = 0;
    recipientId: number = 0;
    recipientFirstName: string = '';
    recipientLastName: string = '';
    content: string = '';
    hasMedia: boolean = false;
    isSeen: boolean = false;
    parentMessageId: boolean = false;
    createdAt: Date = null;
    modifiedAt: Date = null;
}