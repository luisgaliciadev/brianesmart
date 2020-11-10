import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-viajes-cond',
  templateUrl: './viajes-cond.component.html',
  styles: [
  ]
})
export class ViajesCondComponent implements OnInit {

  viajes = [];
  desde = 0;
  hasta = 5;
  loading = false;
  totalRegistros = 0;
  search = '';
  activeButton;
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  paginas = 0;
  pagina = 1;
  dni;
  zonasConductor = '';
  idZona = 0;
  totalHoras = 0;
  tarifaViajes = [];
  totalComision = 0;

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
    // this.fhHasta = '2020-08-20';
   }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getZonasConcutor();
    this.dni = this._userService.user.IDEN;
    // this.getVaijesConductor();
  }

  async getVaijesConductor() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    // if (this.idZona == 0) {
    //   return;
    // }
    this.loading = true;
    this.search = '0';
    this._registerService.getViajesHoras(this.search, this.fhDesde, this.fhHasta, this.dni, this.idZona).subscribe(
      (response: any) => {
        // console.log(response);
        this.viajes = response.viajes;
        this.tarifaViajes = response.viajesTarifa;
        this.totalRegistros = response.viajes.length;
        // this.totalComision = response.comisionTotalHoras;
        this.totalComision = response.comisionTotalViajes;
        this.totalHoras = response.horasPagar;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  async printer() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listoreportpro/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/listoreportpro/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  getZonasConcutor() {
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
      }
    );
  }

}
