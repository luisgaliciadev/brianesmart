import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-list-saldospeaje',
  templateUrl: './list-saldospeaje.component.html',
  styles: [
  ]
})
export class ListSaldospeajeComponent implements OnInit {

  peajes = [];
  search = '';
  fhDesde = '';
  fhHasta = '';

  constructor(
    public _userService: UserService,
    public _route: ActivatedRoute,
    public _registerService: RegisterService
  ) { }

  ngOnInit(): void {
    init_plugins();

    this._route.params.forEach((params: Params) => {
      this.search = params.search;
      this.fhDesde = params.desde;
      this.fhHasta = params.hasta
      if (this.search === '') {
        this.search = '0';
      }
    });

    this.getPeajeSaldos();
  }

  getPeajeSaldos() {
    this._registerService.getPeajeSaldos(this.search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        console.log(response);
        this.peajes = response.peajeSaldos;
      }
    );
  }

  activePrinter() {
    setTimeout(this.printer, 2000);
    this._userService.closeReport();
  }

  printer() {
    window.print();
  }

  toPrint() {
    var contenido= document.getElementById('report').innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
    window.close();
  }

}
