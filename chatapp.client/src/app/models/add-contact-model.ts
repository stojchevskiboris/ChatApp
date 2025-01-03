export class AddContactModel {
    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    profilePicture: string = '';
    isAdded: boolean = false;
    hasRequestedBack: boolean = false;
    requestId: number;
    email: string = '';
    // dateOfBirth: string = '';
    // phone: string = '';
    createdAt: string = '';
    modifiedAt: string = '';
}