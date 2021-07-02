import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-consulta-viatico',
  templateUrl: './consulta-viatico.component.html',
  styles: [
  ]
})
export class ConsultaViaticoComponent implements OnInit {

  resumenViaticos = [];
  totalRegistros = 0;
  idConductor = '';
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  loading = false;
  URL = environment.URL_SERVICES;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
  ) { 
    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.fhDesde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url); 
    this.idConductor = this._userService.user.IDEN;
  }

  async getViaticos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.loading = true;
    this._registerService.getResumenViaticosPorConductor(this.idConductor, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.resumenViaticos = response.viaticosResumen;
        this.totalRegistros = this.resumenViaticos.length;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  generarComprobanteConductor(idViatico, idConductor) {
    this.loading = true;
    this._registerService.generarComprobanteConductor(idViatico, idConductor).subscribe(
      (response: any) => {
        if(response) {
          this.descargar(response.nombreDoc);
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  async descargar(archivo) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }   
    window.open(this.URL +'/image/viaticos-conductor/' + archivo);   
  }

}
