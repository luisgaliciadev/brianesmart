import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Viatico } from 'src/app/models/viatico.model';
import { ViaticoDeta } from 'src/app/models/viaticoDeta.model';
import { URL_SERVICES } from 'src/app/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viatico',
  templateUrl: './viatico.component.html',
  styles: [
  ]
})
export class ViaticoComponent implements OnInit {
  fhDesde;
  fhHasta;
  date = new Date();
  fecha;
  mes;
  dia;
  loading = false;
  tipoBusqueda = 1;
  year: number;
  nroSemana: number;
  years = [];
  semanas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
  totalRegistros = 0;
  dias = [];
  motivosNoOp = [];
  idZona = 1;
  zonasConductor: any[] = [];
  registrando = false;
  productividadOps = [];
  viatico: Viatico = new Viatico(0,0,0,'','',0,0);
  viaticos: ViaticoDeta = new ViaticoDeta(0,'',0,0,0,0,false,false,false,0,0);
  montoTotalViaticos = 0;
  idViatico = 0;
  modificar = false;
  estatus = 0;
  URL = URL_SERVICES;
  actualizando = false;
  diasFeriado = [];
  tarifaDomingo = 8;
  tarifaFeriado = 8;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    public _route: ActivatedRoute
  ) {
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
    this.getDiasFeriados();
    this._route.params.forEach((params: Params) => {
      this.idViatico = params.id;
      if (this.idViatico > 0) {
        this.modificar = true;
        this.getViatico();
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

  getDiasFeriados() {
    this._registerService.getDiasFeriados().subscribe(
      (response: any) => {
        this.diasFeriado = response.diasFeriado;
        // console.log(response);
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

  getViatico() {
    this.loading = true;
    this._registerService.getViatico(this.idViatico).subscribe(
      (response: any) => {
        this.estatus = response.viatico.ESTATUS;
        this.nroSemana = response.viatico.NRO_SEMANA;
        this.year = response.viatico.ANIO;
        this.idZona = response.viatico.ID_ZONA;
        this.getDetaViaticos();
        if (this.estatus > 1) {
          this.actualizando = true;
        }
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  
  getDetaViaticos() {
    this._registerService.getDetaViaticos(this.nroSemana, this.year, this.idViatico, 0).subscribe(
      (response: any) => {
        this.productividadOps = response.diasViaticos;   
        // console.log(this.productividadOps);
        this.dias = response.dias;       
        this.totalRegistros = response.diasViaticos.length;
        var viaticosTotal = 0;
        this.productividadOps.forEach(function (productividadOp) {
          viaticosTotal = viaticosTotal + productividadOp.TOTAL;
        });
        this.montoTotalViaticos = viaticosTotal;
        this.loading = false;
      },
      (error:any) => {
        this.totalRegistros = 0;
        this.dias = [];
        this.loading = false;
      }
    );
  }

  async deleteViaticos() { 
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
        this._registerService.deleteViaticos(this.idViatico).subscribe(
          (response: any) => {
            if(response) {
              this._router.navigate(['/viaticos']);
            }
          }
        );
      } 
    });
  }

  async aprobarViaticos() {
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
      title: 'Aprobar Viáticos',
      text: "¿Desea aprobar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registrando = true;
        this._registerService.aprobarViaticos(this.idViatico).subscribe(
          (response: any) => {
            if(response) {
              // this._router.navigate(['/viaticos']);
              this.getViatico();
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

  async getProductividadop() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.nroSemana == 0 || this.year == 0 || this.idZona == 0) {
      return;
    }
    this.productividadOps = [];
    this.totalRegistros = 0;
    this.dias = [];
    this.loading = true;
    this._registerService.getRepProductividadCond(this.nroSemana, this.year, this.idZona).subscribe(
      (response: any) => {
        this.productividadOps = response.diasProductividad;     
        // console.log(this.productividadOps); 
        this.dias = response.dias;       
        this.totalRegistros = response.diasProductividad.length;
        var j = -1;
        var viaticoTotal = 0;                 
        var productividad = response.diasProductividad;
        var feriados = this.diasFeriado;
        var feriadoTarifa = this.tarifaFeriado;
        var domingoTarifa = this.tarifaDomingo;        
        this.productividadOps.forEach(function (productividadOp) { 
          j++;
          viaticoTotal = 0;
          if (productividadOp.dia1.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia1.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia1.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia2.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia2.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia2.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia3.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia3.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia3.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia4.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia4.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia4.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia5.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia5.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia5.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia6.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia6.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia6.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }
          if (productividadOp.dia7.check1 == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno1;
          }
          if (productividadOp.dia7.check2 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno2;
          }
          if (productividadOp.dia7.check3 == 1 && productividadOp.ID_ZONA == 1) {
            viaticoTotal = viaticoTotal + productividadOp.dia1.turno3;
          }

          // TARIFA DIAS DOMINGOS
          var montoDiaDomingo = 0;
          if (productividadOp.dia7.check2 == 1 && productividadOp.dia7.check3 == 1 && productividadOp.ID_ZONA == 1)  {
            montoDiaDomingo = domingoTarifa;
          }
          // TARIFA DIAS DOMINGOS

           // TARIFA DIAS FERIADOS
          var montoFeriado = 0         
          if (productividadOp.ID_ZONA == 1) {
            if(productividadOp.dia1.check1 == 1 || productividadOp.dia1.check2 == 1 || productividadOp.dia1.check3 == 1) {
              let arrayFecha = productividadOp.dia1.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );             
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia2.check1 == 1 || productividadOp.dia2.check2 == 1 || productividadOp.dia2.check3 == 1) {
              let arrayFecha = productividadOp.dia2.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );             
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia3.check1 == 1 || productividadOp.dia3.check2 == 1 || productividadOp.dia3.check3 == 1) {
              let arrayFecha = productividadOp.dia3.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );              
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia4.check1 == 1 || productividadOp.dia4.check2 == 1 || productividadOp.dia4.check3 == 1) {
              let arrayFecha = productividadOp.dia4.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );              
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia5.check1 == 1 || productividadOp.dia5.check2 == 1 || productividadOp.dia5.check3 == 1) {
              let arrayFecha = productividadOp.dia5.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );              
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia6.check1 == 1 || productividadOp.dia6.check2 == 1 || productividadOp.dia6.check3 == 1) {
              let arrayFecha = productividadOp.dia6.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );              
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
            if(productividadOp.dia7.check1 == 1 || productividadOp.dia7.check2 == 1 || productividadOp.dia7.check3 == 1) {
              let arrayFecha = productividadOp.dia7.fecha.split('/');
              let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
              let resultado = feriados.find( dia => 
                dia.DIA_FERIADO.substring(0, 10) === fecha
              );              
              if(resultado) {
                montoFeriado = montoFeriado + feriadoTarifa;
              }
            }
          }
          // FIN TARIFAS DIAS FERIADOS
      
          productividad[j].TOTAL = viaticoTotal + productividad[j].REINTEGRO + montoDiaDomingo + montoFeriado;
        });

        this.productividadOps = productividad;

        var viaticosTotal = 0;
        this.productividadOps.forEach(function (productividadOp) {
          viaticosTotal = viaticosTotal + productividadOp.TOTAL;
        });
       
        this.montoTotalViaticos = viaticosTotal;
        this.loading = false;
      },
      (error:any) => {
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

  async guardarViatico() { 
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.productividadOps.length == 0) {
      Swal.fire('Mensaje', 'No existen registros a guardar.', 'warning');
      return;
    }
    this.registrando = true;
    this._registerService.registerViatico(this.productividadOps, this.nroSemana, this.year, this.idZona,this.montoTotalViaticos).subscribe(
      (response: any) => {
        if (response) {         
          this._router.navigate(['/viaticos']);
        }
        this.registrando = false;
      },
      error => {
        this.registrando = false;
      }
    );
  }

  async updateViatico(i, nroDia) {  
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.actualizando = true;
    this._registerService.updateViatico(this.productividadOps[i], this.nroSemana, this.year, this.idZona,this.montoTotalViaticos,this.idViatico,nroDia).subscribe(
      (response: any) => {        
        if (response) {         
         this.actualizando = false;
        }
        
      },
      error => {
        this.actualizando = false;
      }
    );
  }

  async generarComprobantes(id) {
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
      title: 'Generar Comprobantes',
      text: `¿Desea generar los comprobantes? No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registrando = true;
        this._registerService.generarComprobantes(id).subscribe(
          (response: any) => {
            if(response) {
              this.getViatico();
              this.registrando = false;
            }
          },
          (error) => {
            this.registrando = false;
          }
        );   
      } 
    });
  }

  async verResumen(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.loadReport();    
    window.open('#/listresumenviaticos/' + id, '0', '_blank');
  }


  montos(i, nroDia) {
    // return;
    // console.log(this.productividadOps[i]);
    this.productividadOps[i].TOTAL = 0;
    var viaticoTotal = 0;
    if (this.productividadOps[i].dia1.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia1.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia1.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }
    if (this.productividadOps[i].dia2.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia2.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia2.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }
    if (this.productividadOps[i].dia3.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia3.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia3.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }
    if (this.productividadOps[i].dia4.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia4.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia4.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }
    if (this.productividadOps[i].dia5.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia5.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia5.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }    
    if (this.productividadOps[i].dia6.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia6.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia6.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }
    if (this.productividadOps[i].dia7.check1 == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno1;
    }
    if (this.productividadOps[i].dia7.check2 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno2;
    }
    if (this.productividadOps[i].dia7.check3 == 1 && this.idZona == 1) {
      viaticoTotal = viaticoTotal + this.productividadOps[i].dia1.turno3;
    }

    var montoDiaDomingo = 0;
    if (this.productividadOps[i].dia7.check2 == 1 && this.productividadOps[i].dia7.check3 == 1 && this.idZona == 1)  {
      montoDiaDomingo = this.tarifaDomingo;
    }

    var montoFeriado = 0    
    if (this.idZona == 1) {
      if(this.productividadOps[i].dia1.check1 == 1 || this.productividadOps[i].dia1.check2 == 1 || this.productividadOps[i].dia1.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia1.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia2.check1 == 1 || this.productividadOps[i].dia2.check2 == 1 || this.productividadOps[i].dia2.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia2.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia3.check1 == 1 || this.productividadOps[i].dia3.check2 == 1 || this.productividadOps[i].dia3.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia3.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia4.check1 == 1 || this.productividadOps[i].dia4.check2 == 1 || this.productividadOps[i].dia4.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia4.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia5.check1 == 1 || this.productividadOps[i].dia5.check2 == 1 || this.productividadOps[i].dia5.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia5.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia6.check1 == 1 || this.productividadOps[i].dia6.check2 == 1 || this.productividadOps[i].dia6.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia6.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }

      if(this.productividadOps[i].dia7.check1 == 1 || this.productividadOps[i].dia7.check2 == 1 || this.productividadOps[i].dia7.check3 == 1) {
        let arrayFecha = this.productividadOps[i].dia7.fecha.split('/');
        let fecha = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
        let resultado = this.diasFeriado.find( dia => 
          dia.DIA_FERIADO.substring(0, 10) === fecha
        ); 
        if(resultado) {
          montoFeriado = montoFeriado + this.tarifaFeriado;
        }
      }
    }
    
    this.productividadOps[i].TOTAL = viaticoTotal + this.productividadOps[i].REINTEGRO + montoDiaDomingo + montoFeriado;
    var total = 0;
    this.productividadOps.forEach(function (productividadOp) {
      total = total + productividadOp.TOTAL
    });
    this.montoTotalViaticos = total;  
    if (this.idViatico > 0) {
      this.updateViatico(i, nroDia);
    }
    
  }

  async generarNuevoComprobanteConductor(idConductor) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    // console.log(idConductor);
    this.loading = true;
    this._registerService.generarNuevoComprobanteConductor(this.idViatico,idConductor).subscribe(
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

  limpiar() {
    this.productividadOps = [];
    this.totalRegistros = 0;
    this.dias = [];
  }

}