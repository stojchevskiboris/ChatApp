import { Component, OnInit } from '@angular/core';
import { AddContactModel } from '../../../models/add-contact-model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';
import { ToastrService } from 'ngx-toastr';
import { SignalRService } from '../../../services/signalr.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent implements OnInit {

  query: string = '';
  isLoading: boolean = false;
  searchResults: Array<AddContactModel> = [];
  currentUserId: number = 0;
  loading: boolean = false;
  private searchDebounceTimeout: any;

  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private toastr: ToastrService,
    private signalrService: SignalRService
  ) { }

  ngOnInit(): void {
    this.currentUserId = +(this.authService.getUserId() ?? 0);
    if (this.currentUserId == 0){
      this.authService.logout();
      // toastr: unauthorized
    }
  }

  onSearch(debounce: boolean = false): void {

    if (debounce) {
      clearTimeout(this.searchDebounceTimeout);
      this.searchDebounceTimeout = setTimeout(() => this.onSearch(false), 500); // 300ms debounce
      return;
    }

    if (this.query.trim() === '') {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.requestService.searchUsersToAdd(this.query)
      .subscribe({
        next: (data: any) => {
          this.searchResults = data;
        },
        error: () => {
          console.error('Error fetching search results.');
          this.searchResults = [];
          this.isLoading = false
        },
        complete: () => (this.isLoading = false),
      });

  }

  newRequest(user: AddContactModel): void {
    this.loading = true;
    this.requestService.newRequest(user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = true;
            this.loading = false;
            this.newRequestEvent(user.id);
            // toastr: succesfully sent request
          } else {
            this.loading = false;
            // toastr: succesfully sent request
          }
        },
        error: () => {
          // console.log("Error sending add request");
          this.loading = false
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
    
  newRequestEvent(userToId) {
    this.signalrService.newRequest(userToId).then(() => { })
  }

  cancelRequest(user: AddContactModel): void {
    this.loading = true;
    this.requestService.cancelRequest(user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = false;
            this.loading = false
          } else {
            this.loading = false
          }
        },
        error: () => {
          // console.log("Error cancelling request");
          this.loading = false
        },
        complete: () => {
          this.loading = false;
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
            this.onSearch();
            this.toastr.info('Request accepted');
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
            this.onSearch();
            this.toastr.info('Request rejected');
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

}