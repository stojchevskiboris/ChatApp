import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { GifViewModel } from '../models/gif-view-model';
@Injectable({
  providedIn: 'root'
})
export class GiphyService {

  private gifSearchEndpoint = '/Giphy/Search';

  constructor(private dataService: DataService) { }

  searchGifs(query: string, limit: number = 10): Observable<GifViewModel[]> {
    const params = {
      query,
      limit: limit.toString(),
    };
    return this.dataService.get<GifViewModel[]>(this.gifSearchEndpoint, params);
  }
}