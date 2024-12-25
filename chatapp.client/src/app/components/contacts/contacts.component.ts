import { Component, inject, OnInit } from '@angular/core';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { ToastrService } from 'ngx-toastr';
import { RequestStatusEnum } from '../../models/enums/request-status-enum';
import { RequestDetailsModel } from '../../models/request-details-model';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { RemoveContactDialogComponent } from '../dialogs/remove-contact-dialog/remove-contact-dialog.component';

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
  hasContactsLoaded: boolean = false;
  hasRequests: boolean = false;
  requestsCount: number = 0;

  contacts: UserViewModel[] = [];
  requests: RequestDetailsModel[] = [];
  archivedRequests: RequestDetailsModel[] = [];

  constructor(
    private userService: UserService,
    private requestService: RequestService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getContacts();
    this.getPendingRequests();
    this.getArchivedRequests();
    this.getRequestsCount();
  }

  getContacts() {
    var setFlag: boolean = true;
    setTimeout(() => {
      if (setFlag) {
        this.hasContactsLoaded = false;
      }
    }, 200);
    this.userService.getContacts().subscribe({
      next: (model: UserViewModel[]) => {
        setFlag = false;
        this.contacts = model;
        this.hasContactsLoaded = true;
      },
      error: (err: any) => {
        setFlag = false;
        this.hasContactsLoaded = true;
      },
      complete: () => {
        setFlag = false;
        this.hasContactsLoaded = true;
      }
    })
  }

  getPendingRequests() {
    this.requestService.getPendingRequests().subscribe({
      next: (model: RequestDetailsModel[]) => {
        this.requests = model;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getArchivedRequests() {
    this.requestService.getArchivedRequests().subscribe({
      next: (model: RequestDetailsModel[]) => {
        this.archivedRequests = model;
      },
      error: (err: any) => {
        this.toastr.warning('An unexpected error has occurred');
      },
      complete: () => {
      }
    })
  }

  getRequestsCount() {
    this.requestService.getRequestsCount().subscribe({
      next: (count: number) => {
        this.requestsCount = count
        this.hasRequests = count > 0;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
      }
    })
  }

  addContacts() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  removeContact(contact: UserViewModel): void {
    const dialogRef = this.dialog.open(RemoveContactDialogComponent, {
      data: {
        contact
      },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.userService.removeContact(contact.id).subscribe({
          next: (response: any) => {
            if (response) {
              this.contacts = this.contacts.filter(c => c.id !== contact.id);
              this.toastr.info('Succesfully removed contact');
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
    });
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
