import { Component, inject, OnInit } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { AddContactModel } from '../../models/add-contact-model';
import { ToastrService } from 'ngx-toastr';
import { RequestStatusEnum } from '../../models/enums/request-status-enum';
import { RequestDetailsModel } from '../../models/request-details-model';

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
  loading: boolean = false;

  contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  requests: RequestDetailsModel[] = [];
  archivedRequests: RequestDetailsModel[] = [];

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getPendingRequests();
    this.getArchivedRequests();
  }

  getPendingRequests() {
    this.requestService.getPendingRequests().subscribe({
      next: (model: RequestDetailsModel[]) => {
        this.requests = model
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getArchivedRequests() {
    this.requestService.getArchivedRequests().subscribe({
      next: (model: RequestDetailsModel[]) => {
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
    if (requestId == 0) {
      this.toastr.warning('An unexpected error has occurred');
      return;
    }

    this.loading = true;
    this.requestService.acceptRequest(requestId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.toastr.info('Request accepted');
            this.loadData();
          } else {
            this.toastr.warning('An unexpected error has occurred');
          }
          this.loading = false;
        },
        error: () => {
          this.toastr.warning('An unexpected error has occurred');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  rejectRequest(requestId: number): void {
    if (requestId == 0) {
      this.toastr.warning('An unexpected error has occurred');
      return;
    }

    this.loading = true;
    this.requestService.rejectRequest(requestId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.toastr.info('Request rejected');
            this.loadData();
          } else {
            this.toastr.warning('An unexpected error has occurred');
          }
          this.loading = false;
        },
        error: () => {
          this.toastr.warning('An unexpected error has occurred');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  toggleArchivedRequests(): void {
    this.loadData();
    this.showArchivedRequests = !this.showArchivedRequests;
  }

  changeActiveTab() {
    this.loadData();
    this.showArchivedRequests = false
  }

  getRequestStatus(requestStatusId: number): string {
    return RequestStatusEnum[requestStatusId];
  }
}
