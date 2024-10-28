import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.css'
})
export class LeftPaneComponent {

  constructor() { }

  @Output() selectedChat = new EventEmitter<number>();

  handleSelectedChat(event: number) {
    this.selectedChat.emit(event);
  }

}
