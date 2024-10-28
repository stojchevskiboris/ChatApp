import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
    if (recipientId == null || recipientId == 0) {
      this.isChatSelected = false;

    } else {
      this.isChatSelected = true;
    }
    this.selectedChatRecipientId = recipientId;
  }
}
