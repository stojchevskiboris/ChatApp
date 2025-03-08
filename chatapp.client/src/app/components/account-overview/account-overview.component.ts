import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserViewModel } from '../../models/user-view-model';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../dialogs/add-contact-dialog/add-contact-dialog.component';
import { SignOutDialogComponent } from '../dialogs/sign-out-dialog/sign-out-dialog.component';
import { RequestService } from '../../services/request.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css'
})
export class AccountOverviewComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private requestService: RequestService,
    private router: Router,
    private signalrService: SignalRService
  ) { }

  @Output() resetChat = new EventEmitter<number>();
  @Output() contactsEmitter = new EventEmitter();
  userInitials: string = '';
  currentUser: UserViewModel = new UserViewModel();
  dialog = inject(MatDialog);
  loading: boolean = false;
  hasRequests: boolean = false;
  profilePicture: string = 'assets/img/default-avatar.png';
  hasProfilePicture: boolean = false;
  requestsCount: number = 0;

  ngOnInit(): void {
    var currentUserStr = this.userService.getCurrentUser();
    if (currentUserStr == null || currentUserStr == undefined || currentUserStr == '') {
      this.authService.logout(false);
      this.router.navigate(['/']);
    }
    else {
      this.currentUser = JSON.parse(currentUserStr);
      this.userInitials = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0);
      this.userService.getCurrentUserDetails()
      .subscribe(
        (response: UserViewModel) => {
          if (response) {
            this.currentUser = response;
            if (response.profilePicture) {
              this.profilePicture = response.profilePicture;
              this.hasProfilePicture = true;
            }
          }
          this.loading = false;
        },
        (error) => {
          // console.error('Error loading user data:', error);
          this.loading = false;
          this.toastr.warning('An unexpected error has occurred');
        },
        () => {
          this.loading = false;
        }
      );    }

    this.getRequestsCount();

    this.connectSignalR();
  }
  
  connectSignalR() {
      var connection = this.signalrService.getHubConnection();
      connection.on('OnNewRequest', () => {
        this.getRequestsCount();
      });
  }

  getRequestsCount() {
    this.requestService.getRequestsCount().subscribe({
          next: (count: number) => {
            this.requestsCount = count
            this.hasRequests = count>0;
          },
          error: (err: any) => {
            // console.log(err);
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
      this.contactsEmitter.emit();
      // console.log(`Dialog result: ${result}`);
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