import { BaseSearchModel } from "./base-search-model";

export interface RecipientSearchModel extends BaseSearchModel {
  recipientTypeId?: number;
}
