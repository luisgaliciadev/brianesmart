import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  viatico: Viatico = new Viatico(0,'',0,'','','',0,0,0,0,0);;
  nombreConductor = '';
  idConductor = '';
  dniConductor = '';
  viaticoDeta = [];
  diasSemana = [];
  fhDesde = '';
  fhHasta = '';
  nroSemana = 0;

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getZonasConcutor();
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
              console.log(this.diasSemana);
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
            console.log(this.viaticoDeta);
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
          console.log('Existe');
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

    console.log(montoTotal);
    if (montoTotal === 0) {
      Swal.fire('Mensaje', 'Debe ingresar al menos un registro.', 'warning');
      return;
    }
    
    this._registerService.registerViatico(viaticos).subscribe(
      (response:any) => {
        console.log(response);
        if (response) {
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

}
