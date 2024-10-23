import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { LoadingService } from './services/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private loadingService: LoadingService) {}

  loading: boolean = false;

  ngOnInit() {
    this.loadingService.getLoading().subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

  title = 'chatapp.client';
}
