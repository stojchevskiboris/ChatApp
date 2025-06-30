import { BaseSearchModel } from "./base-search-model";

export interface UserSearchModel extends BaseSearchModel {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: number;
  phone?: string;
  lastActive?: Date;
}