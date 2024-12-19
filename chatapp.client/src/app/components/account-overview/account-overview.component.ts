import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserViewModel } from '../../models/user-view-model';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { SignOutDialogComponent } from '../dialogs/sign-out-dialog/sign-out-dialog.component';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css'
})
export class AccountOverviewComponent {
  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private router: Router
  ) { }

  @Output() resetChat = new EventEmitter<number>();
  userInitials: string = '';
  currentUser: UserViewModel = new UserViewModel();
  dialog = inject(MatDialog);
  loading: boolean = false;
  hasRequests: boolean = false;
  requestsCount: number = 0;

  ngOnInit(): void {
    var currentUserStr = this.authService.getCurrentUser();
    if (currentUserStr == null || currentUserStr == undefined || currentUserStr == '') {
      this.authService.logout(false);
      this.router.navigate(['/']);
    }
    else {
      this.currentUser = JSON.parse(currentUserStr);
      this.userInitials = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0);
    }

    this.getRequestsCount();
  }

  getRequestsCount() {
    this.requestService.getRequestsCount().subscribe({
          next: (count: number) => {
            this.requestsCount = count
            this.hasRequests = count>0;
          },
          error: (err: any) => {
            console.log(err);
          }
        })
  }

  resetChats() {
    this.resetChat.emit(-1);
  }

  addContacts() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  logout() {
    const dialogRef = this.dialog.open(SignOutDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });

  }
}