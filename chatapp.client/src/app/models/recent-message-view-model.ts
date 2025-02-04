export class RecentMessageViewModel {
    id: number = 0;
    senderId: number = 0;
    recipientId: number = 0;
    recipientFirstName: string = '';
    recipientLastName: string = '';
    recipientProfilePicture: string = '';
    content: string = '';
    hasMedia: boolean = false;
    isSeen: boolean = false;
    isSentMessage: boolean = false;
    parentMessageId: number = 0;
    createdAt: Date = null;
    modifiedAt: Date = null;
}