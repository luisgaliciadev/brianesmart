import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import { Viatico } from 'src/app/models/viatico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viaticos-cond',
  templateUrl: './viaticos-cond.component.html',
  styles: [
  ]
})
export class ViaticosCondComponent implements OnInit {
  idZona = 0 ;
  zonasConductor: any[] = [];
  viatico: Viatico = new Viatico(0,'',0,'','','',0,0,0,0,0);
  detaViaticos = [];
  nombreConductor = '';
  idConductor = '';
  dniConductor = '';
  viaticoDeta = [];
  diasSemana = [];
  fhDesde = '';
  fhHasta = '';
  nroSemana = 0;
  modificar = false;
  desde = 0;
  hasta = 7;
  totalRegistros = 0;
  loading = true;
  montoTotal = 0;
  registrando = false;
  paginas = 0;
  pagina = 1;
  detaViaticosTotal = [];

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this._userService.permisoModule(this._router.url);
    this.getZonasConcutor();

    this._route.params.forEach((params: Params) => {
      this.nroSemana = params.semana;
      this.idZona = params.zona;
      if (this.nroSemana > 0) {
        this.modificar = true;
        this.getViatico();
        this.getDetaViaticos();
      } else {
        this.loading = false;
      }
    });
  }

  getViatico() {
    this.loading = true;
    this._registerService.getViatico(this.nroSemana, this.idZona).subscribe(
      (response: any) => {
        this.fhDesde = response.viatico.FH_DESDE.substring(0, 10);
        this.fhHasta = response.viatico.FH_HASTA.substring(0, 10);
        this.montoTotal = response.viatico.MONTO_TOTAL;
      }
    );
  }

  getDetaViaticos() {
    this.loading = true;
    this._registerService.getDetaViatico(this.nroSemana, this.idZona).subscribe(
      (response: any) => {
        this.totalRegistros = response.viaticos.length;
        this.detaViaticosTotal = response.viaticos;
        this.detaViaticos = this.detaViaticosTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 7);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
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

  getConductor(idConductor) {
    if (idConductor) {
      this._registerService.getConductor(idConductor).subscribe(
        (response: any) => {
          this.nombreConductor = response.conductor.Nombre;
          this.dniConductor = response.conductor.ID_Chofer;
        },
        err =>{
          if (err) {
            this.idConductor = '';
            this.nombreConductor = '';
          }
        }
      );
    }
   
  }

  getDatoSemana(dia) {
    this.idZona = 0;
    this.nombreConductor = '';
    this.idConductor = '';
    this.dniConductor = '';
    this._registerService.getDatoSemana(dia).subscribe(
      (response: any) => {
        if (response) {
          this.fhHasta = response.datosSemana.FH_FIN;
          this.nroSemana = response.datosSemana.NRO_SEMANA;       
          this._registerService.getDiasSemana(dia, this.fhHasta).subscribe(
            (response: any) => {
              this.diasSemana = response.diasSemana;
            }
          );
        }
      }
    );
  }

  getTarifasViatico(idZona) {
    if (idZona > 0) {
      this._registerService.getTarifasViatico(idZona).subscribe(
        (response: any) => {
          if (response) {
            let viaticos = [];
            this.diasSemana.forEach(function (dias) {              
              viaticos.push({
                dia: dias.Date,
                montoTotal: 0,
                monto1: response.tarifas.TARIFA1,
                monto2: response.tarifas.TARIFA2,
                monto3: response.tarifas.TARIFA3,
                check1: false,
                check2: false,
                check3: false
              });
            });
            this.viaticoDeta = viaticos;
          }
        }
      );
    } else {
      return;
    }
  }

  getVerificarViatico(i, data, check) {
    var dia = data.dia;
    this._registerService.getVerificarViatico(this.dniConductor, dia).subscribe(
      (response: any) => {
        if (response) {
          this.montos(i, data);
        } else {
          // console.log('Existe');
          if (check === 1) {
            this.viaticoDeta[i].check1 = false;
          }

          if (check === 2) {
            this.viaticoDeta[i].check2 = false;
          }

          if (check === 3) {
            this.viaticoDeta[i].check3 = false;
          }
          
        }
      }
    );
  }
 
  registerViatico(data) {
    if (this.dniConductor === '') {
      Swal.fire('Mensaje', 'Debe seleccionar un conductor.', 'warning');
      return;
    }
    this.registrando = true;
    let viaticos = [];
    let dni = this.dniConductor;
    this.viaticoDeta.forEach(function (viatico) {  
      let monto1 = 0;
      let monto2 = 0;
      let monto3 = 0;

      if (viatico.check1) {
         monto1 = viatico.monto1;
      }  

      if (viatico.check2) {
        monto2 = viatico.monto2;
      }  

      if (viatico.check3) {
        monto3 = viatico.monto3;
      }
      
      viaticos.push({
        ID_ZONA: data.idZona,
        ID_CONDUCTOR: dni,
        FH_DESDE: data.fhDesde,
        FH_HASTA: data.fhHasta,
        NRO_SEMANA: data.nroSemana,
        FH_DIA: viatico.dia,
        MONTO1: monto1,
        MONTO2: monto2,
        MONTO3: monto3,
        MONTO_TOTAL: viatico.montoTotal
      });

    });

    var montoTotal = 0
    viaticos.forEach(function (viatico) {
      montoTotal = montoTotal + viatico.MONTO_TOTAL
    });

    if (montoTotal === 0) {
      Swal.fire('Mensaje', 'Debe ingresar al menos un registro.', 'warning');
      return;
    }
    
    this._registerService.registerViatico(viaticos).subscribe(
      (response:any) => {
        if (response) {
          this.registrando = false;
          this.limpiar();
        }
      }
    );
  }

  montos(i,data) {
    this.viaticoDeta[i].montoTotal = 0;
    if (data.check1) {
      this.viaticoDeta[i].montoTotal = this.viaticoDeta[i].montoTotal + data.monto1;
    } 

    if (data.check2) {
      this.viaticoDeta[i].montoTotal = this.viaticoDeta[i].montoTotal + data.monto2;
    }

    if (data.check3) {
      this.viaticoDeta[i].montoTotal = this.viaticoDeta[i].montoTotal + data.monto3;
    } 
  }

  limpiar() {
    this.dniConductor = '';
    this.nombreConductor = '';
    this.idConductor = '';
    this.viaticoDeta = []
    this.getTarifasViatico(this.idZona)
  }

  filtroPagina () {
    this.detaViaticos = this.detaViaticosTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

  changePage(valor: number, pagina: number) {
    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;
    this.pagina = this.pagina + pagina;

    if (this.desde >= this.totalRegistros) {
      this.desde = this.desde - 7;
      this.hasta = this.desde + 7;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 7) {
      this.hasta = 7;
    }

    if (this.pagina >= this.paginas) {
      this.pagina = this.paginas;
    }
    
    if (this.pagina <= 0) {
      this.pagina = 1;
    }

    this.filtroPagina();
  }

}
