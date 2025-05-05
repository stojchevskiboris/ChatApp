import { AddContactModel } from "./add-contact-model";

export class RequestDetailsModel {
    id: number = 0;
    userFrom: AddContactModel;
    userTo: AddContactModel;
    requestStatus: number = 0;
    isDeleted: boolean = false;
    createdAt: string = '';
    modifiedAt: string = '';
}