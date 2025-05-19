import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon(
      `more_vert_red`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/material/custom-mat-icons/more_vert_red.svg")
    );
  }

  ngOnInit() {
  }

  title = 'chatapp.client';
}
