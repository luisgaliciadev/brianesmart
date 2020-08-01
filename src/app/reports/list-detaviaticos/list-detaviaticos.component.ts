import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-list-detaviaticos',
  templateUrl: './list-detaviaticos.component.html',
  styles: [
  ]
})
export class ListDetaviaticosComponent implements OnInit {

  detaViaticosTotal = [];
  fhDesde = '';
  fhHasta = '';
  montoTotal = 0;
  nroSemana = 0;
  idZona = 0;
  totalRegistros = 0
  detaViaticos = [];
  zona = ''
  

  constructor(
    public _registerService: RegisterService,
    public _route: ActivatedRoute,
    public _userService: UserService,
  ) { }

  ngOnInit(): void {
    init_plugins();

    this._route.params.forEach((params: Params) => {
      this.nroSemana = params.semana;
      this.idZona = params.zona;
    });

    this.getViatico();
    this.getDetaViaticos();
  }

  ngOnDestroy() {
    this._userService.closeReport();
  }

  getViatico() {
    this._registerService.getViatico(this.nroSemana, this.idZona).subscribe(
      (response: any) => {
        console.log(response);
        this.fhDesde = response.viatico.FH_DESDE.substring(0, 10);
        this.fhHasta = response.viatico.FH_HASTA.substring(0, 10);
        this.montoTotal = response.viatico.MONTO_TOTAL;
        this.zona = response.viatico.NB_ZONA_COND;
      }
    );
  }

  getDetaViaticos() {
    this._registerService.getDetaViatico(this.nroSemana, this.idZona).subscribe(
      (response: any) => {
        console.log(response);
        this.totalRegistros = response.viaticos.length;
        this.detaViaticos = response.viaticos;
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
