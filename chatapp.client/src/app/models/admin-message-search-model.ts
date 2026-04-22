import { BaseSearchModel } from "./base-search-model";

export interface AdminMessageSearchModel extends BaseSearchModel {
  senderId?: number;
  content?: string;
  isSeen?: boolean;
  isDeleted?: boolean;
}
