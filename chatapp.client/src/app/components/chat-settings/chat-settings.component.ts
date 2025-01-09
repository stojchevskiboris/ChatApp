import { Component, Input, SimpleChanges } from '@angular/core';
import { UserViewModel } from '../../models/user-view-model';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrl: './chat-settings.component.css'
})
export class ChatSettingsComponent {

  @Input() recipientId: number | null = null;
  recipient: UserViewModel = null;
  defaultAvatar = 'img/default-avatar.png';
  recipientProfilePicture: string = this.defaultAvatar;
  loading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.setRecipient();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && !changes['recipientId'].firstChange) {
      this.setRecipient();
    }
  }

  setRecipient(withLoading: boolean = true): void {
    if (withLoading) {
      this.loading = true;
    }
    this.userService.getUserDetails(this.recipientId).subscribe({
      next: (model: UserViewModel) => {
        this.recipient = new UserViewModel();
        this.recipient = model
        if (model.profilePicture) {
          this.recipientProfilePicture = model.profilePicture;
        } else {
          this.recipientProfilePicture = this.defaultAvatar;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    })
  }
}
