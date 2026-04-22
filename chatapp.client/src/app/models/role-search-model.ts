import { BaseSearchModel } from "./base-search-model";

export interface RoleSearchModel extends BaseSearchModel {
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: number;
}
