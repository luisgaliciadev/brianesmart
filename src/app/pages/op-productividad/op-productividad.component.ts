import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { ProductividadOp } from 'src/app/models/productividadop.model';

@Component({
  selector: 'app-op-productividad',
  templateUrl: './op-productividad.component.html',
  styles: [
  ]
})
export class OpProductividadComponent implements OnInit {

  fhDesde;
  fhHasta;
  date = new Date();
  fecha;
  mes;
  dia;
  loading = true;
  tipoBusqueda = 1;
  year: number;
  nroSemana: number;
  years = [];
  semanas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52];
  // productividadOps = new ProductividadOp('','','','',0,0,'','','','','',0);
  productividadOps;
  totalRegistros = 0;
  dias = [];
  motivosNoOp = [];
  idZona = 1;
  zonasConductor: any[] = [];

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
  ) {
    this.loading = false;
    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    let y = new Date()
    this.year = y.getFullYear()

    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.fhDesde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fecha = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
   }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getYears();
    this.getDatoSemana(this.fecha);
    this.getMotivoNoOp();
    this.getZonasConcutor();
  }

  getMotivoNoOp() {
    this._registerService.getMotivoNoOp().subscribe(
      (response: any) => {
        this.motivosNoOp = response.motivos;
      }
    );
  }

  getYears() {
    this._registerService.getYears().subscribe(
      (response: any) => {
        this.years = response.years;
      }
    );
  }

  anio() {
    console.log(this.year);
  }

  getDatoSemana(dia) {
    this._registerService.getDatoSemana(dia).subscribe(
      (response: any) => {
        if (response) {
          this.nroSemana = response.datosSemana.NRO_SEMANA;      
          // console.log('semana:', this.nroSemana); 
        }
      }
    );
  }

  getProductividadop() {
    if (this.nroSemana == 0 || this.year == 0 || this.idZona == 0) {
      return;
    }
    this.loading = true;
    this._registerService.getProductividadop(this.tipoBusqueda, this.nroSemana, this.year, this.fhDesde, this.fhHasta,this.idZona).subscribe(
      (response: any) => {
        console.log(response)
        this.productividadOps = response.diasProductividad;
        // console.log(this.productividadOps);
        this.dias = response.dias
        // console.log( this.dias);
        this.totalRegistros = response.diasProductividad.length
        this.loading = false;
      }
    );
  }

  getZonasConcutor() {
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
      }
    );
  }

}
