import { Component, OnInit, OnDestroy, ViewChild,  } from '@angular/core';
import { SearchImagesService } from '../search-images.service';
import { Subscription } from 'rxjs/Subscription';
import { Search } from '../shared/model/search';
import { Imagen } from '../shared/model/imagen';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  search: Search;
  images: Imagen[];

  private subscription: Subscription = new Subscription();
  constructor(private searchImagesService: SearchImagesService) {}

  ngOnInit() {
    this.subscription.add(this.searchImagesService.search$.subscribe(data => {
      this.search = data;
      this.images = this.search.hits;
    }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  openImage(image: Imagen) {
    window.open(image.largeImageURL, '_blank');
  }

}
