import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrl: './chat-settings.component.css'
})
export class ChatSettingsComponent {

  @Input() recipientId: number | null = null;


}
