import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GiphyService } from '../../services/giphy.service';
import { GifViewModel } from '../../models/gif-view-model';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.css']
})
export class GifSearchComponent {
  searchQuery = '';
  limit: number = 10;
  rating: string = 'r';
  allRatings: string[] = ['g', 'pg', 'pg-13', 'r']

  gifs: GifViewModel[] = [];
  @Output() gifSelected = new EventEmitter<string>();
  @ViewChild('gifSearchDiv') gifSearchDiv: any

  constructor(private giphyService: GiphyService) { }

  ngAfterViewInit(): void {
    this.gifSearchDiv.nativeElement.addEventListener('focusout', () => {
      // error: clicks on the input in the div triggers focusout
      console.log("item-clicked");
    });
  }

  onSearch(): void {
    if (this.searchQuery.length > 2) {
      this.giphyService.searchGifs(
        this.searchQuery,
        this.limit,
        this.rating
      )
        .subscribe((response: any) => {
          this.gifs = response;
          this.gifs.map((gif) =>{
            if(!gif.previewUrl || gif.previewUrl == ''){
              gif.previewUrl = gif.imageUrl;
            }
          });
        });
    }
    else {
      this.gifs = [];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.gifs = [];
  }

  selectGif(gif: GifViewModel): void {
    this.gifSelected.emit(gif.imageUrl);
  }
}
