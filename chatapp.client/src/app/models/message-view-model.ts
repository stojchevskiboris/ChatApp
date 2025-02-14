import { MessageMediaViewModel } from "./message-media-view-model";

export class MessageViewModel {
    id: number = 0;
    senderId: number = 0;
    recipientId: number = 0;
    content: string = '';
    media: MessageMediaViewModel | null = null;
    type: string = '';
    hasMedia: boolean = false;
    isSeen: boolean = false;
    parentMessageId: boolean = false;
    createdAt: string = '';
    modifiedAt: string = '';
}