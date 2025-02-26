export class RecentChatViewModel {
    id: number = 0;
    recipientId: number = 0;
    recipientUsername: string = '';
    recipientFirstName: string = '';
    recipientLastName: string = '';
    recipientProfilePicture: string = '';
    content: string = '';
    hasMedia: boolean = false;
    mediaType: string = '';
    isSeen: boolean = false;
    isSentMessage: boolean = false;
    parentMessageId: number = 0;
    createdAt: Date = null;
    modifiedAt: Date = null;
}