import { BaseSearchModel } from "./base-search-model";

export interface MediaSearchModel extends BaseSearchModel {
  messageId?: number;
  fileType?: string;
}
