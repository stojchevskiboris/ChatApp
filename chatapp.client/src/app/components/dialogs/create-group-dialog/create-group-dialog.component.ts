import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { UserViewModel } from '../../../models/user-view-model';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.css'
})
export class CreateGroupDialogComponent implements OnInit {
  groupName: string = '';
  contacts: UserViewModel[] = [];
  selectedContacts: number[] = [];
  isAddMemberMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    if (data && data.groupId) {
      this.isAddMemberMode = true;
    }
  }

  ngOnInit(): void {
    this.userService.getContacts().subscribe(contacts => {
      if (this.isAddMemberMode) {
        // Filter out contacts already in the group
        const existingMemberIds = (this.data.members || []).map((m: any) => m.userId);
        this.contacts = contacts.filter(c => !existingMemberIds.includes(c.id));
      } else {
        this.contacts = contacts;
      }
    });
  }

  toggleContact(contactId: number): void {
    const index = this.selectedContacts.indexOf(contactId);
    if (index === -1) {
      this.selectedContacts.push(contactId);
    } else {
      this.selectedContacts.splice(index, 1);
    }
  }

  submit(): void {
    if (this.isAddMemberMode) {
      this.addMembers();
    } else {
      this.createGroup();
    }
  }

  createGroup(): void {
    if (!this.groupName.trim()) return;

    const currentUserId = +this.authService.getUserId();
    const model = {
      name: this.groupName,
      createdByUser: { id: currentUserId },
      groupUsersId: [currentUserId, ...this.selectedContacts]
    };

    this.dataService.post('/Groups/CreateGroup', model).subscribe(response => {
      this.dialogRef.close(true);
    });
  }

  addMembers(): void {
    if (this.selectedContacts.length === 0) return;

    let completed = 0;
    this.selectedContacts.forEach(userId => {
      const model = {
        groupId: this.data.groupId,
        userId: userId
      };
      this.dataService.post('/GroupUsers/CreateGroupUser', model).subscribe(() => {
        completed++;
        if (completed === this.selectedContacts.length) {
          this.dialogRef.close(true);
        }
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
