import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { ActivatedRoute, Params } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-list-resumenviaticos',
  templateUrl: './list-resumenviaticos.component.html',
  styles: [
  ]
})
export class ListResumenviaticosComponent implements OnInit {

  resumenViaticos = [];
  nroSemana = 0;
  periodo = '';
  totalViaticos = 0;

  constructor(
    public _userService: UserService,
    public _route: ActivatedRoute,
    public _registerService: RegisterService
  ) { }

  ngOnInit(): void {
    init_plugins();

    this._route.params.forEach((params: Params) => {
     
      this.getViaticos(params.id);
     
    });
  }

  getViaticos(id) {
    this._registerService.getResumenViaticos(id).subscribe(
      (response: any) => {
        this.resumenViaticos = response.viaticosResumen;
        this.nroSemana = response.viaticosResumen[0].NRO_SEMANA;
        this.periodo = response.viaticosResumen[0].PERIODO;
        var total = 0

        this.resumenViaticos.forEach(function(viatico) {
          total = total + viatico.TOTAL;
        });

        this.totalViaticos = total;

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
