import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Gif, SearchGiftsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})

export class GifsService {


  constructor( private http: HttpClient ) {

    this.results = JSON.parse( localStorage.getItem('results')! )  || [];

    if( localStorage.getItem('historial') ){
      this._historial = JSON.parse( localStorage.getItem('historial')! );
    }
  }

  private apiKey     :string = 'miHwaWhglUFRnLqmNzQijczyhOeEjTH1'
  private _historial :string[] = [];
  private _urlApi    :string = 'https://api.giphy.com/v1/gifs';

  public results: Gif[] = [];


  get historial(){
    return [...this._historial];
  }

  searchGifs( query:string = '' ){
    
    query = query.trim().toLocaleLowerCase();
    
    if( !this._historial.includes( query ) ){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial',JSON.stringify(this._historial))

    }


    const params = new HttpParams()
                 .set('api_key',this.apiKey)
                 .set('limit','10')
                 .set('q',query)
    
    this.http.get<SearchGiftsResponse>(`${this._urlApi}/search`,{ params })
    .subscribe( ( resp ) => {
      this.results = resp.data;
      localStorage.setItem('results', JSON.stringify(this.results))
    } )
    
  }

}
