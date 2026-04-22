import { BaseSearchModel } from "./base-search-model";

export interface GroupSearchModel extends BaseSearchModel {
  name?: string;
  createdByUserId?: number;
}
