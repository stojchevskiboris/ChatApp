import { Component, inject, OnInit } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { AddContactModel } from '../../models/add-contact-model';
import { ToastrService } from 'ngx-toastr';
import { RequestStatusEnum } from '../../models/enums/request-status-enum';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {

  dialog = inject(MatDialog);
  showArchivedRequests: boolean = false;
  currentUserId: string = null;
  requestStatusEnum: typeof RequestStatusEnum = RequestStatusEnum;

  contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  requests: AddContactModel[] = [];
  archivedRequests: AddContactModel[] = [];

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getPendingRequests();
    this.getArchivedRequests();
  }

  getPendingRequests() {
    this.requestService.getPendingRequests().subscribe({
      next: (model: AddContactModel[]) => {
        this.requests = model
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getArchivedRequests() {
    this.requestService.getArchivedRequests().subscribe({
      next: (model: AddContactModel[]) => {
        this.archivedRequests = model
      },
      error: (err: any) => {
        this.toastr.warning('An unexpected error has occurred');
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
    if (requestId == 0){
      this.toastr.warning('An unexpected error has occurred');
      return;
    }
    this.requestService.acceptRequest(requestId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.toastr.info('Request accepted');
            this.getPendingRequests();
          } else {
            this.toastr.warning('An unexpected error has occurred');
          }
        },
        error: () => {
          this.toastr.warning('An unexpected error has occurred');
        }
      });
  }

  rejectRequest(requestId: number): void {
    console.log(`Rejected request ID: ${requestId}`);
    this.requests = this.requests.filter(request => request.id !== requestId);
  }

  toggleArchivedRequests(): void {
    this.showArchivedRequests = !this.showArchivedRequests;
  }

  changeActiveTab() {
    this.showArchivedRequests = false
  }

  getRequestStatus(requestStatusId: number): string {
    return RequestStatusEnum[requestStatusId];
  }
}
