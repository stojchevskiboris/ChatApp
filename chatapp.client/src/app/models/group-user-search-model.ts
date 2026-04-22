import { BaseSearchModel } from "./base-search-model";

export interface GroupUserSearchModel extends BaseSearchModel {
  groupId?: number;
  userId?: number;
}
