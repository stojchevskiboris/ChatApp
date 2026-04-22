import { UserViewModel } from "./user-view-model";

export class GroupViewModel {
  id: number = 0;
  name: string = '';
  createdByUser: UserViewModel | null = null;
  groupUsersId: number[] = [];
  createdAt: string = '';
  modifiedAt: string = '';
}
