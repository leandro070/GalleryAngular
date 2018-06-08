import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Search } from './shared/model/search';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Imagen } from './shared/model/imagen';
@Injectable()
export class SearchImagesService {

  search: Search;
  search$: Observable<Search>;
  private searchSubject: Subject<Search> = new Subject();
  constructor(private httpClient: HttpClient) {
    this.search$ = this.searchSubject.asObservable();
   }

   lastRequestURL: string;
  getImages(parameters) {
    let url = `https://pixabay.com/api/?`;
    Object.keys(parameters).forEach(key => {
      if (parameters[key] !== '' && parameters[key] !== 0 ) {
      url = url + key + '=' + parameters[key] + '&';
      }
    });
    url = url.slice(0, -1);
    console.log(url);
    this.lastRequestURL = url;
    return this.httpClient.get<Search>(url).pipe(
        tap(response => { console.log('Service', response); }));
  }

  getNextPage(page: number) {
    const url = this.lastRequestURL + `&page=${page}`;
    console.log(url);
    return this.httpClient.get<Search>(url).pipe(
      tap(response => { console.log('Service', response); }));
  }

  refresh(search) {
    this.searchSubject.next(search);
  }


}

export interface ImagenParametros {
  key: string; // API KEY
  q: string; // Un término de búsqueda codificado en URL
  lang: string; // Código de idioma del idioma en el que se buscará
  image_type: string; // Filtrar los resultados por tipo de imagen.
  orientation: string; // Si una imagen es más ancha de lo que es alta o más alta que ancha.
  category: string; // Filtrar resultados por categoría.
  min_width: number; // Ancho mínimo de la imagen.
  min_height: number; // Alto mínimo de la imagen.
  colors: string; // Filtrar imágenes por propiedades de color
  editors_choice: boolean; // Seleccione imágenes que hayan recibido un premio Elección del Editor.
  safesearch: boolean; // Una bandera que indica que solo se deben devolver imágenes adecuadas para todas las edades.
  order: string; // Cómo se deben ordenar los resultados
  per_page: number; // Determine la cantidad de resultados por página.
}
