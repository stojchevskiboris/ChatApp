import { Component, inject } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {

  dialog = inject(MatDialog);
  showArchivedRequests: boolean = false;

  contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  requests = [
    { id: 1, name: 'David' },
    { id: 2, name: 'Eve' },
  ];

  archivedRequests = [
    { id: 1, name: 'John', status: 'Accepted' },
    { id: 2, name: 'Jane', status: 'Rejected' },
  ];

  addContacts() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  removeContact(contactId: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
  }

  acceptRequest(requestId: number): void {
    console.log(`Accepted request ID: ${requestId}`);
    this.requests = this.requests.filter(request => request.id !== requestId);
  }

  rejectRequest(requestId: number): void {
    console.log(`Rejected request ID: ${requestId}`);
    this.requests = this.requests.filter(request => request.id !== requestId);
  }

  toggleArchivedRequests(): void {
    this.showArchivedRequests = !this.showArchivedRequests;
  }

  changeActiveTab(){
    this.showArchivedRequests = false
  }
}
