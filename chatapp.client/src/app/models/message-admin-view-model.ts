import { MessageMediaViewModel } from "./message-media-view-model";

export class MessageAdminViewModel {
    id: number = 0;
    senderUsername: string = '';
    senderId: number = 0;
    recipientUsername: string = '';
    recipientId: number = 0;
    content: string = '';
    media: MessageMediaViewModel | null = null;
    type: string = '';
    hasMedia: boolean = false;
    isSeen: boolean = false;
    isDeleted: boolean = false;
    parentMessageId: number = 0;
    createdAt: string = '';
    modifiedAt: string = '';
}