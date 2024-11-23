import { Component, EventEmitter, Output } from '@angular/core';
import { GiphyService } from '../../services/giphy.service';
import { GifViewModel } from '../../models/gif-view-model';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.css']
})
export class GifSearchComponent {
  searchQuery = '';
  gifs: GifViewModel[] = [];
  @Output() gifSelected = new EventEmitter<string>();

  constructor(private giphyService: GiphyService) {}

  onSearch(): void {
    if (this.searchQuery.length > 2) {
      this.giphyService.searchGifs(this.searchQuery).subscribe((response: any) => {
        this.gifs = response;
      });
    }
  }

  selectGif(gifUrl: string): void {
    this.gifSelected.emit(gifUrl);
  }
}
