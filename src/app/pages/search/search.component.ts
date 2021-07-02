import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {
  public URL = environment.URL_SERVICES;
  public totalH: number;
  public totalD: number;
  public totalU: number;

  constructor(
    public _activateRoute: ActivatedRoute,
    public _http: HttpClient
  ) {
    
    this._activateRoute.params.subscribe( params => {
      let termino = params.termino;
      this.search(termino);
    });
  }

  ngOnInit() {
  }

  search(termino: string) {

  }
}
