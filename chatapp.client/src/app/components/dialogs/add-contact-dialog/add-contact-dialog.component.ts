import { Component, OnInit } from '@angular/core';

import { AddContactModel } from '../../../models/add-contact-model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  query: string = '';
  isLoading: boolean = false;
  // searchResults: Array<AddContactModel> = [];
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
    this.userService.searchUsersToAdd(this.currentUserId, this.query)
      .subscribe({
        next: (data: any) => {
          this.searchResults = data.map((user: any) => ({
            ...user,
            added: false,
          }));
        },
        error: () => {
          console.error('Error fetching search results.');
          this.searchResults = [];
        },
        complete: () => (this.isLoading = false),
      });

  }

  addContact(user: AddContactModel): void {
    this.userService.addUser(this.currentUserId, user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = true;
            // toastr: succesfully sent request
          } else {
            console.error('Failed to add contact');
          }
        },
        error: () => console.error('Error sending add request.'),
      });
  }

  cancelRequest(user: AddContactModel): void {
    this.userService.cancelRequest(this.currentUserId, user.id)
      .subscribe({
        next: (response: any) => {
          if (response) {
            user.isAdded = false;
            // toastr: friend request cancelled
          } else {
            console.error('Failed to add contact');
          }
        },
        error: () => console.error('Error sending add request.'),
      });
  }
}
