import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { GifViewModel } from '../models/gif-view-model';
@Injectable({
  providedIn: 'root'
})
export class GiphyService {

  private gifSearchEndpoint = '/Giphy/Search';

  constructor(private dataService: DataService) { }

  searchGifs(query: string, limit: number = 10, rating = 'r'): Observable<GifViewModel[]> {
    if(query == null || query == ''){
      return of([]);
    }
    const params = {
      query,
      limit: limit.toString(),
      rating,
    };
    return this.dataService.get<GifViewModel[]>(this.gifSearchEndpoint, params);
  }
}