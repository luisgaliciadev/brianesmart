import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-list-descuentopeaje',
  templateUrl: './list-descuentopeaje.component.html',
  styles: [
  ]
})
export class ListDescuentopeajeComponent implements OnInit {

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

    this.getPeajeDescuentos();
  }

  getPeajeDescuentos() {
    this._registerService.getPeajeDescuentos(this.search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.peajes = response.peajeDescuentos;
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
