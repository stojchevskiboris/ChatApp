import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AddContactModel } from '../../../models/add-contact-model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss'],
})
export class AddContactDialogComponent {
  query: string = '';
  isLoading: boolean = false;
  // searchResults: Array<AddContactModel> = [];
  searchResults: Array<AddContactModel> = [
    {
      "id": 1,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 2,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris2@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 3,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris3@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 8,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "nextsense",
      "dateOfBirth": "2024-10-17T14:30:59.339",
      "phone": "string",
      "profilePicture": null,
      "isAdded": false
    }, {
      "id": 1,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 2,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris2@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 3,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris3@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 8,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "nextsense",
      "dateOfBirth": "2024-10-17T14:30:59.339",
      "phone": "string",
      "profilePicture": null,
      "isAdded": false
    }, {
      "id": 1,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 2,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris2@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 3,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris3@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 8,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "nextsense",
      "dateOfBirth": "2024-10-17T14:30:59.339",
      "phone": "string",
      "profilePicture": null,
      "isAdded": false
    }, {
      "id": 1,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 2,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris2@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 3,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "stojchevskiboris3@gmail.com",
      "dateOfBirth": "2002-02-25T07:55:49.538",
      "phone": "075855147",
      "profilePicture": null,
      "isAdded": false
    },
    {
      "id": 8,
      "firstName": "Boris",
      "lastName": "Stojchevski",
      "email": "nextsense",
      "dateOfBirth": "2024-10-17T14:30:59.339",
      "phone": "string",
      "profilePicture": null,
      "isAdded": false
    },
  ];

  constructor(
    private userService: UserService
  ) { }

  onSearch(): void {
    if (this.query.trim() === '' || this.query.trim().length < 3) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.userService.searchUsers(this.query)
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
    this.userService.addUser(user.id)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            user.isAdded = true;
          } else {
            console.error('Failed to add contact');
          }
        },
        error: () => console.error('Error sending add request.'),
      });
  }
}
