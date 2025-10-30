import { BaseSearchModel } from "./base-search-model";

export interface MessageSearchModel extends BaseSearchModel {
  senderUsername?: string;
  senderId?: string;
  recipientUsername?: string;
  recipientId?: string;
  content?: string;
  seenStatus?: number;
  deletedStatus?: number;
  hasMediaStatus?: number;
}