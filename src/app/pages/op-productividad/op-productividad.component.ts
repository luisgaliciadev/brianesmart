import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';

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
  productividadOps;
  totalRegistros = 0;
  dias = [];
  motivosNoOp = [];
  idZona = 1;
  zonasConductor: any[] = [];
  registrando = false;
  idReport = 0;
  modificar = false;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    public _route: ActivatedRoute
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
    this._route.params.forEach((params: Params) => {
      this.idReport = params.id;
      if (this.idReport > 0) {
        this.modificar = true;
        this.getReportProOp();
      } else {
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
        this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia
        this.getDatoSemana(this.fecha);
        this.productividadOps = [];
        this.totalRegistros = 0;
        this.dias = [];
        this.modificar = false;
      }
    });
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
    // console.log(this.year);
  }

  getDatoSemana(dia) {
    this._registerService.getDatoSemana(dia).subscribe(
      (response: any) => {
        if (response) {
          this.nroSemana = response.datosSemana.NRO_SEMANA;      
        }
      }
    );
  }

  getReportProOp() {
    this.loading = true;
    this._registerService.getReportPro(this.idReport).subscribe(
      (response: any) => {
        this.year = response.reportProOp.ANIO;
        this.nroSemana = response.reportProOp.NRO_SEMANA;
        this.idZona = response.reportProOp.ID_ZONA;
        this.loading = false;
        this.getDetaReportProOp();
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  getDetaReportProOp() {
    this.loading = true;
    this._registerService.getDetaReportPro(this.nroSemana, this.year, this.idReport).subscribe(
      (response: any) => {
        console.log(response)
        this.productividadOps = response.diasProductividad;
        this.dias = response.dias
        this.totalRegistros = response.diasProductividad.length
        this.loading = false;
      },
      (error:any) => {
        this.productividadOps = [];
        this.totalRegistros = 0;
        this.dias = [];
        this.loading = false;
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
        this.productividadOps = response.diasProductividad;
        this.dias = response.dias
        this.totalRegistros = response.diasProductividad.length
        this.loading = false;
      },
      (error:any) => {
        this.productividadOps = [];
        this.totalRegistros = 0;
        this.dias = [];
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

  guardarRepOp() {
    this.registrando = true;
    this._registerService.registerReportPro(this.productividadOps, this.nroSemana, this.year, this.idZona).subscribe(
      (response: any) => {
        this.registrando = false;
        this._router.navigate(['/reportsprodop']);
      },
      error => {
        this.registrando = false;
      }
    );
  }

}
