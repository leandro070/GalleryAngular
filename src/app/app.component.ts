import { Component, Input, OnInit } from '@angular/core';
import { SearchImagesService, ImagenParametros } from './search-images.service';
import { Search } from './shared/model/search';
import { Imagen } from './shared/model/imagen';
import { dataAPI } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Gallery App';
  search: Search;
  images: Imagen[];
  pager: {
    totalItems: number,
    currentPage: number,
    pageSize: number,
    totalPages: number,
    startPage: number,
    endPage: number,
    startIndex: number,
    endIndex: number,
    pages: number[],
} = null;
  parametersDefault: ImagenParametros = {
    key: dataAPI.APIKEY,
    q: '',
    lang: 'en',
    image_type: 'all',
    orientation: 'all',
    category: '',
    min_width: 0,
    min_height: 0,
    colors: '',
    editors_choice: false,
    safesearch: false,
    order: 'popular',
    per_page: 21,
  };
  parameters: ImagenParametros;
  categories = [
  'fashion',
  'nature',
  'backgrounds',
  'science',
  'education',
  'people',
  'feelings',
  'religion',
  'health',
  'places',
  'animals',
  'industry',
  'food',
  'computer',
  'sports',
  'transportation',
  'travel',
  'buildings',
  'business',
  'music'];
  colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'turquoise',
  'blue',
  'pink',
  'white',
  'gray',
  'black',
  'brown'];
  imageType = ['all', 'photo', 'illustration', 'vector'];
  orientation = ['all', 'horizontal', 'vertical'];
  editors_choice: boolean;
  order = ['popular', 'latest'];

  constructor(private searchProvider: SearchImagesService) {
    this.parameters = this.parametersDefault;
  }

  ngOnInit() {
    this.getImagesFiltred();
  }

  setParameter(key, value) {
    switch (key) {
      case 'category': {
        this.parameters.category = value;
        break;
      }
      case 'color': {
        this.parameters.colors = value;
        break;
      }
      case 'type': {
        this.parameters.image_type = value;
        break;
      }
      case 'order': {
        this.parameters.order = value;
        break;
      }
      case 'orientation': {
        this.parameters.orientation = value;
        break;
      }
      case 'editor-choice': {
        this.parameters.editors_choice = value;
        break;
      }
    }
  }

  getImagesFiltred() {
    console.log(this.parameters);
    this.searchProvider.getImages(this.parameters).subscribe(data => {
      this.search = data;
      this.images = this.search.hits;
      this.searchProvider.refresh(this.search);
      this.pager = this.getPager(this.search.totalHits, 21);
    });
  }

  setPage(page: number) {
    this.searchProvider.getNextPage(page).subscribe(data => {
      this.search = data;
      this.images = this.search.hits;
      this.searchProvider.refresh(this.search);
      this.pager.currentPage = page;
    });
  }

  getPager(totalItems: number, itemsPerPage: number = 21, currentPage: number = 1) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

     // calculate start and end item indexes
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

     // create an array of pages to ng-repeat in the pager control
     const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

     // return object with all pager properties required by the view
     return {
         totalItems: totalItems,
         currentPage: currentPage,
         pageSize: itemsPerPage,
         totalPages: totalPages,
         startPage: startPage,
         endPage: endPage,
         startIndex: startIndex,
         endIndex: endIndex,
         pages: pages
     };
  }

}
