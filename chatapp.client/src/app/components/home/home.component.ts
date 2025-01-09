import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserViewModel } from '../../models/user-view-model';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

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
  startChatEvent: boolean = false;
  lastActiveSubscription: Subscription;

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getUserDetails();
    }

    this.updateLastActive();
    this.lastActiveSubscription = interval(60000).subscribe(x => {
      this.updateLastActive();
    });
  }

  ngOnDestroy(){
    this.lastActiveSubscription.unsubscribe();
  }

  getUserDetails() {
    this.userService.getUserDetails(+this.userId).subscribe({
      next: (model: UserViewModel) => {
        this.currentUser = model
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  startChat() {
    this.startChatEvent = !this.startChatEvent;
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

  updateLastActive() {
    this.userService.updateLastActive()
      .subscribe({
        next: () => console.log('Last active updated'),
        error: (err: HttpErrorResponse) => console.log('Error updating last active', err),
      });
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.currentUser = new UserViewModel();
  }
}
