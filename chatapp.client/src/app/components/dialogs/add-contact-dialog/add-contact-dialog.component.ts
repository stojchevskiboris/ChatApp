import { Component, OnInit } from '@angular/core';

import { AddContactModel } from '../../../models/add-contact-model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) { }

  query: string = '';
  isLoading: boolean = false;
  searchResults: Array<AddContactModel> = [];
  currentUserId: number = 0;

  ngOnInit(): void {
    this.currentUserId = +(this.authService.getUserId() ?? 0);
    if (this.currentUserId == 0){
      this.authService.logout();
      // toastr: unauthorized
    }
  }

  onSearch(): void {
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
    this.requestService.newRequest(user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = true;
            // toastr: succesfully sent request
          } else {
            // toastr: succesfully sent request
          }
        },
        error: () => console.error('Error sending add request.'),
      });
  }

  cancelRequest(user: AddContactModel): void {
    this.requestService.cancelRequest(user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = false;
            // toastr: friend request cancelled
          } else {
            // toastr: failed to cancel friend request
          }
        },
        error: () => console.error('Error sending add request.'),
      });
  }
}