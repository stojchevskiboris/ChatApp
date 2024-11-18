import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  isChatSelected: boolean = false;
  selectedChatRecipientId: number = 0;
  userId: string = '';
  currentUser: UserViewModel = new UserViewModel();
  isChatSettingsEnabled: boolean = true;

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userService.getUserDetails(+this.userId).subscribe({
      next: (model: UserViewModel) => {
        this.currentUser = model
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.currentUser = new UserViewModel();
  }

  handleSelectedChat(recipientId: number) {
    this.selectedChatRecipientId = recipientId;
    if (recipientId === -1 || recipientId == null) {
      this.isChatSelected = false;
    } else {
      this.isChatSelected = true;
    }
  }

  toggleSettings(): void {
    this.isChatSettingsEnabled = !this.isChatSettingsEnabled;
  }
}
