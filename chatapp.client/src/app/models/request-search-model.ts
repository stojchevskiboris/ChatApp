import { BaseSearchModel } from "./base-search-model";

export interface RequestSearchModel extends BaseSearchModel {
  userFromId?: number;
  userToId?: number;
  requestStatus?: number;
  isDeleted?: boolean;
}
