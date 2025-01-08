export class AddContactModel {
    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    profilePicture: string = '';
    isAdded: boolean = false;
    hasRequestedBack: boolean = false;
    requestId: number;
    username: string = '';
    // dateOfBirth: string = '';
    // phone: string = '';
    createdAt: string = '';
    modifiedAt: string = '';
}