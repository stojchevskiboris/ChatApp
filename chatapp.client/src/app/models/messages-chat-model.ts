import { MessageViewModel } from "./message-view-model";

export class MessagesChatModel {
    oldestMessageId: number = 0;
    messages: MessageViewModel[] = [];
}