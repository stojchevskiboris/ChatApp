import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserViewModel } from '../../models/user-view-model';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../add-contact/add-contact-dialog.component';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css'
})
export class AccountOverviewComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  @Output() resetChat = new EventEmitter<number>();
  userInitials: string = '';
  currentUser: UserViewModel = new UserViewModel();
  dialog = inject(MatDialog);

  ngOnInit(): void {
    var currentUserStr = this.authService.getCurrentUser();
    if (currentUserStr == null || currentUserStr == undefined || currentUserStr == '') {
      this.logout();
    }
    else {
      this.currentUser = JSON.parse(currentUserStr);
      this.userInitials = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0);
    }
  }

  resetChats() {
    this.resetChat.emit(-1);
  }

  addFriends() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '70%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
