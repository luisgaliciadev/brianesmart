import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

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
  semanas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
  productividadOps;
  totalRegistros = 0;
  dias = [];
  motivosNoOp = [];
  idZona = 1;
  zonasConductor: any[] = [];
  registrando = false;
  idReport = 0;
  modificar = false;
  actualizando = false;
  estatus = 0;
  reportAct = [];
  viajesNuevos = [];

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
        // console.log(this.motivosNoOp);
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
        this.estatus = response.reportProOp.ESTATUS;
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
        // console.log(response);
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

  async getProductividadop() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.nroSemana == 0 || this.year == 0 || this.idZona == 0) {
      return;
    }
    this.loading = true;
    this._registerService.getProductividadop(this.tipoBusqueda, this.nroSemana, this.year, this.fhDesde, this.fhHasta,this.idZona).subscribe(
      (response: any) => {
        console.log('response:', response)
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

  async actualiazarViajes() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.nroSemana == 0 || this.year == 0 || this.idZona == 0) {
      return;
    }
    this.loading = true;
    this._registerService.getProductividadop(this.tipoBusqueda, this.nroSemana, this.year, this.fhDesde, this.fhHasta,this.idZona).subscribe(
      (response: any) => {      
        // this.reportAct = response.diasProductividad;     
        var reportAct = response.diasProductividad;     
        var reportOp = this.productividadOps;

        var nuevosViajes = [];
        var i = 0;

        // Actualizar registros
        this.productividadOps.forEach(function (productividadOp) {       
          const resultado = reportAct.find( viajeAct => 
            viajeAct.ID_TRACTO === productividadOp.ID_VEHICULO && viajeAct.ID_CONDUCTOR2 === productividadOp.ID_CONDUCTOR 
          );
          if (resultado) {
            // console.log('resultado:', resultado);
            reportOp[i].dia1.turno1 = resultado.dia1.turno1;
            if (reportOp[i].dia1.turno1 > 1) {
              reportOp[i].dia1.motivo1 = 0;
            }
            reportOp[i].dia1.turno2 = resultado.dia1.turno2;
            if (reportOp[i].dia1.turno2 > 1) {
              reportOp[i].dia1.motivo2 = 0;
            }
            reportOp[i].dia1.turno3 = resultado.dia1.turno3;
            if (reportOp[i].dia1.turno3 > 1) {
              reportOp[i].dia1.motivo3 = 0;
            }

            reportOp[i].dia2.turno1 = resultado.dia2.turno1;
            if (reportOp[i].dia2.turno1 > 1) {
              reportOp[i].dia2.motivo1 = 0;
            }
            reportOp[i].dia2.turno2 = resultado.dia2.turno2;
            if (reportOp[i].dia2.turno2 > 1) {
              reportOp[i].dia2.motivo2 = 0;
            }
            reportOp[i].dia2.turno3 = resultado.dia2.turno3;
            if (reportOp[i].dia2.turno3 > 1) {
              reportOp[i].dia2.motivo3 = 0;
            }

            reportOp[i].dia3.turno1 = resultado.dia3.turno1;
            if (reportOp[i].dia3.turno1 > 1) {
              reportOp[i].dia3.motivo1 = 0;
            }
            reportOp[i].dia3.turno2 = resultado.dia3.turno2;
            if (reportOp[i].dia3.turno2 > 1) {
              reportOp[i].dia3.motivo2 = 0;
            }
            reportOp[i].dia3.turno3 = resultado.dia3.turno3;
            if (reportOp[i].dia3.turno3 > 1) {
              reportOp[i].dia3.motivo3 = 0;
            }

            reportOp[i].dia4.turno1 = resultado.dia4.turno1;
            if (reportOp[i].dia4.turno1 > 1) {
              reportOp[i].dia4.motivo1 = 0;
            }
            reportOp[i].dia4.turno2 = resultado.dia4.turno2;
            if (reportOp[i].dia4.turno2 > 1) {
              reportOp[i].dia4.motivo2 = 0;
            }
            reportOp[i].dia4.turno3 = resultado.dia4.turno3;
            if (reportOp[i].dia4.turno3 > 1) {
              reportOp[i].dia4.motivo3 = 0;
            }

            reportOp[i].dia5.turno1 = resultado.dia5.turno1;
            if (reportOp[i].dia5.turno1 > 1) {
              reportOp[i].dia5.motivo1 = 0;
            }
            reportOp[i].dia5.turno2 = resultado.dia5.turno2;
            if (reportOp[i].dia5.turno2 > 1) {
              reportOp[i].dia5.motivo2 = 0;
            }
            reportOp[i].dia5.turno3 = resultado.dia5.turno3;
            if (reportOp[i].dia5.turno3 > 1) {
              reportOp[i].dia5.motivo3 = 0;
            }

            reportOp[i].dia6.turno1 = resultado.dia6.turno1;
            if (reportOp[i].dia6.turno1 > 1) {
              reportOp[i].dia6.motivo1 = 0;
            }
            reportOp[i].dia6.turno2 = resultado.dia6.turno2;
            if (reportOp[i].dia6.turno2 > 1) {
              reportOp[i].dia6.motivo2 = 0;
            }
            reportOp[i].dia6.turno3 = resultado.dia6.turno3;
            if (reportOp[i].dia6.turno3 > 1) {
              reportOp[i].dia6.motivo3 = 0;
            }

            reportOp[i].dia7.turno1 = resultado.dia7.turno1;
            if (reportOp[i].dia7.turno1 > 1) {
              reportOp[i].dia7.motivo1 = 0;
            }
            reportOp[i].dia7.turno2 = resultado.dia7.turno2;
            if (reportOp[i].dia7.turno2 > 1) {
              reportOp[i].dia7.motivo2 = 0;
            }
            reportOp[i].dia7.turno3 = resultado.dia7.turno3;
            if (reportOp[i].dia7.turno3 > 1) {
              reportOp[i].dia7.motivo3 = 0;
            }
          }
          i++;
        });   

        if (reportOp.length > 80) {
          this.updateRepOpNuevos(reportOp.slice(0,80));          
          this.updateRepOpNuevos(reportOp.slice(80,160));
          if (reportOp.slice(160,240).length > 0) {
            // console.log('160');
            this.updateRepOpNuevos(reportOp.slice(160,240));
          }
        } else {
          this.updateRepOpNuevos(reportOp);
        }

        this.productividadOps = reportOp;

        // Insetar nuevos viajes
        reportAct.forEach(function (viajes) {
          const resultado = reportOp.find( viaje => 
            viaje.ID_VEHICULO  === viajes.ID_TRACTO && viaje.ID_CONDUCTOR === viajes.ID_CONDUCTOR2 
          );
          if (!resultado) {
            nuevosViajes.push({
              ANIO: viajes.ANIO,
              ID_CONDUCTOR2: viajes.ID_CONDUCTOR2, 
              ID_TRACTO: viajes.ID_TRACTO,
              NOMBRE_CONDUCTOR: viajes.NOMBRE_CONDUCTOR,
              NRO_SEMANA: viajes.NRO_SEMANA,
              PLACA_TRACTO: viajes.PLACA_TRACTO,
              dia1: viajes.dia1,
              dia2: viajes.dia2,
              dia3: viajes.dia3,
              dia4: viajes.dia4,
              dia5: viajes.dia5,
              dia6: viajes.dia6,
              dia7: viajes.dia7
            });
          }
        });
        this.viajesNuevos = nuevosViajes; 
        // console.log(this.viajesNuevos);      
        this.guardarRepOpNuevos();
        this.loading = false;
      },
      (error:any) => {
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

  async guardarRepOp() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.productividadOps.length == 0) {
      Swal.fire('Mensaje', 'No existen registros a guardar.', 'warning');
      return;
    }
    this.registrando = true;
    this._registerService.registerReportPro(this.productividadOps, this.nroSemana, this.year, this.idZona).subscribe(
      (response: any) => {
        this.registrando = false;
        // console.log(response);
        this._router.navigate(['/reportsprodop']);
      },
      error => {
        this.registrando = false;
      }
    );
  }
  
  guardarRepOpNuevos() {
    if (this.viajesNuevos.length == 0) {
      // Swal.fire('Mensaje', 'No existen registros a guardar.', 'warning');
      return;
    }
    this.registrando = true;
    // console.log(this.viajesNuevos)
    this._registerService.registerReportProNuevos(this.viajesNuevos, this.nroSemana, this.year, this.idZona, this.idReport).subscribe(
      (response: any) => {
        this.registrando = false;
        // console.log(response);
        // this._router.navigate(['/reportsprodop']);
        this.getReportProOp();
      },
      error => {
        this.registrando = false;
      }
    );
  }

  async updateRepOp(i,nroDia) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idReport == 0) {
      return;
    }
    this.actualizando = true;
    // console.log('this.productividadOps[i]:', this.productividadOps[i]);
    this._registerService.updateReportPro(this.productividadOps[i], this.nroSemana, this.year, this.idZona, this.idReport,nroDia).subscribe(
      (response: any) => {
        // console.log(response);
        // this.getReportProOp();
        this.actualizando = false;
      }
    );
  }

  async deleteDetaRepOp(i,nroDia) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idReport == 0) {
      return;
    }
    this.actualizando = true;
    // console.log('this.productividadOps[i]:', this.productividadOps[i]);
    this._registerService.updateReportPro(this.productividadOps[i], this.nroSemana, this.year, this.idZona, this.idReport,nroDia).subscribe(
      (response: any) => {
        // console.log(response);
        // this.getReportProOp();
        this.actualizando = false;
      }
    );
  }

  updateRepOpNuevos(productividadOps) {
    if (this.idReport == 0) {
      return;
    }
    this.actualizando = true;
    // console.log('this.productividadOps[i]:', this.productividadOps[i]);
    this._registerService.updateReportProNuevo(productividadOps, this.nroSemana, this.year, this.idZona, this.idReport).subscribe(
      (response: any) => {
        // console.log(response);
        this.actualizando = false;
      }
    );
  }

  async aprobarReporte(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Aprobar Reporte',
      text: "¿Desea aprobar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registrando = true;
        this._registerService.aprobarReportePro(id, this.idZona).subscribe(
          (response:any) => {
            if(response) {
              this.getReportProOp();
              this.registrando = false;
            }
          },
            error => {
              if(error) {
                this.registrando = false;
              }
            }
        );
      } 
    });
  }

  async deleteReportOp() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Anular Registro',
      text: "¿Desea anular este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._registerService.deleteReportOP(this.idReport).subscribe(
          (response: any) => {
            if(response) {
              this._router.navigate(['/reportsprodop']);
            }
          }
        );
      } 
    });
  }

  limpiar() {
    this.productividadOps = [];
    this.totalRegistros = 0;
    this.dias = [];
  }

}
