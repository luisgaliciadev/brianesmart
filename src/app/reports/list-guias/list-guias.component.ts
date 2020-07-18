import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { ActivatedRoute, Params } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-list-guias',
  templateUrl: './list-guias.component.html',
  styles: [
  ]
})
export class ListGuiasComponent implements OnInit {

  guias = [];
  search = '';
  fhDesde = '';
  fhHasta = '';

  constructor(
    public _userService: UserService,
    public _route: ActivatedRoute,
    public _registerServices: RegisterService
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

    this.getGuias();
  }

  ngOnDestroy() {
    this._userService.closeReport();
  }

  getGuias() {
    this._registerServices.getGuias(this.search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.guias = response.guias;
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
