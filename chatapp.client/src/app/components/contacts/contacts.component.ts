import { Component, inject, OnInit } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { AddContactModel } from '../../models/add-contact-model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {

  dialog = inject(MatDialog);
  showArchivedRequests: boolean = false;
  currentUserId: string = null;

  contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  requests: AddContactModel[] = [];

  archivedRequests = [
    { id: 1, name: 'John', status: 'Accepted' },
    { id: 2, name: 'Jane', status: 'Rejected' },
  ];

  constructor(
    private requestService: RequestService,
  ) { }

  ngOnInit(): void {
    this.getPendingRequests();
  }
  
  private getPendingRequests(){
      this.requestService.getPendingRequests().subscribe({
        next: (model: AddContactModel[]) => {
          this.requests = model
        },
        error: (err: any) => {
          console.log(err);
        }
      })
  }

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
