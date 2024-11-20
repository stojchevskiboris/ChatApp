import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserViewModel } from '../../models/user-view-model';

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

  userInitials: string = '';
  currentUser: UserViewModel = new UserViewModel();
  @Output() resetChat = new EventEmitter<number>();

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

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
