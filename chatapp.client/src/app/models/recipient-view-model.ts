export class RecipientViewModel {
  id: number = 0;
  recipientTypeId: number = 0;
  recipientUserId: number | null = null;
  recipientUsername: string | null = null;
  recipientGroupId: number | null = null;
  recipientGroupName: string | null = null;
  createdAt: string = '';
  modifiedAt: string = '';
}
