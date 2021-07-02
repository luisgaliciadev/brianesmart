import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-tareo-operaciones',
  templateUrl: './tareo-operaciones.component.html',
  styles: [
  ]
})
export class TareoOperacionesComponent implements OnInit {
  
  zonasConductor = [];
  semanas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
  meses = [];
  nroMes = 0;
  years = [];
  year = 0;
  idZona = 0;
  date = new Date();
  conductores = [];
  dniConductor = '';
  nombreConductor = '';
  idConductor = 0;
  idTareo = 0;
  dias = [];
  detaTareo = [];
  motivos = [];
  modificacion = false;
  disabled = false;
  cantTurnos = 0;
  vistaConductor = false;
  buscarConductor = '';
  cantConductoresSelec = 0;
  totalRegistros = 0;
  tareoOperaciones: any;

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
      this.year =  this.date.getFullYear();
      this.nroMes = this.date.getMonth() + 1;
      this.cantConductoresSelec = 0;
   }

  ngOnInit(): void {
    this.getZonasConcutor();
    this.getMeses();
    this.getYears();
    this.getMotivosTareoOp();
    this.getConductores()
    this._route.params.forEach((params: Params) => {
      this.dniConductor = '';
      this.nombreConductor = '';
      this.idConductor = 0;
      this.year =  this.date.getFullYear();
      this.nroMes = this.date.getMonth() + 1;
      this.modificacion = false;
      this.disabled = false;
      this.idZona = 0;
      this.dniConductor = '';
      this.nombreConductor = '';
      this.idConductor = 0;
      this.idTareo = parseInt(params.id);
      if (this.idTareo > 0) {
        this.modificacion = true;
        this.getTareoOp();
      }
    });
  }

  getMeses() {
    this._registerService.getMeses().subscribe(
      (response: any) => {        
        this.meses = response.meses;
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

  getZonasConcutor() {
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor;
      }
    );
  }

  getConductores() {
    this.spinner.show();
    this._registerService.getConductoresDisponibles().subscribe(
      (response: any) => {
        this.conductores = response.conductores;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getMotivosTareoOp() {
    this._registerService.getMotivosTareoOp().subscribe(
      (response: any) => {
        this.motivos = response.motivos;
      }
    );
  }

  getTareoOp() {
    this.spinner.show();
    this._registerService.getTareoOp(this.idTareo).subscribe(
      (response: any) => {
        this.tareoOperaciones = response;
        this.dias = response.diasMes;
        this.detaTareo = response.tareoOperacionesTotal;
        this.totalRegistros = response.tareoOperacionesTotal.length;
        this.year = response.tareoOperaciones.ANIO;
        this.nroMes = response.tareoOperaciones.MES;
        this.idZona = response.tareoOperaciones.ID_ZONA;
        this.cantTurnos =  response.tareoOperaciones.CANT_TURNOS;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  registerTareoOp() {
    let data = {
      anio: this.year,
      mes: this.nroMes,
      idZona: this.idZona,
      idUsuario: this._userService.user.ID_USER,
    }   
    this.spinner.show();
    this._registerService.registerTareoOp(data).subscribe(
      (response: any) => {        
        this._router.navigate(['/tareo-operaciones',response.tareoOperaciones.ID_TAREO_OP]);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async getConductor(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (id === '') {
      return;
    }
    this._registerService.getConductor(id).subscribe(
      (response: any) => {
        this.dniConductor = response.conductor.ID_Chofer;
        this.nombreConductor = response.conductor.Nombre;
        this.idConductor = response.conductor.ID_CONDUCTOR;
      },
      error => {
        this.idConductor = 0;
        this.nombreConductor = '';
      }
    );
  }

  async agregarConductor() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    
    if (this.idTareo === 0) { 
      return;
    }

    if (this.idConductor === 0) { 
      Swal.fire('Mensaje', 'Debe selccionar un conductor.', 'warning');
      return;
    }

    const conductor = this.detaTareo.find( datos => datos.idConductor === this.idConductor);
    if (conductor) {
      Swal.fire('Mensaje', 'Conductor ya registrado', 'warning');
      return;
    }
    let data = {
      idTareo: this.idTareo,
      idConductor: this.idConductor,
      fecha: `${this.year}-${this.nroMes}-1`,
      turno1: 0,
      turno2: 0,
      turno3: 0,
      idUsuario: this._userService.user.ID_USER
    }
    this.spinner.show();
    this._registerService.registerDetaTareoOp(data).subscribe(
      (response: any) => {
        this.getTareoOp();
        Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
        this.idConductor = 0;
        this.dniConductor = '';
        this.nombreConductor = '';
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async agregarConductorMultiple() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }    
    if (this.idTareo === 0) { 
      return;
    }
    let contador = 0;
    this.conductores.forEach(conductor => {
      if (conductor.seleccion) {          
        contador++;  
      }
    });
    if (contador === 0) { 
      Swal.fire('Mensaje', 'Debe selccionar al menos un conductor.', 'warning');
      return;
    }  
    let data = [];    
    this.conductores.forEach(conductor => {
      if (conductor.seleccion) {
        const datosConductor = this.detaTareo.find( datos => datos.idConductor === conductor.ID_CONDUCTOR);
        if (!datosConductor) {
          data.push({
            idTareo: this.idTareo,
            idConductor: conductor.ID_CONDUCTOR,
            fecha: `${this.year}-${this.nroMes}-1`,
            turno1: 0,
            turno2: 0,
            turno3: 0,
            idUsuario: this._userService.user.ID_USER
        });
        }
      }
    });  
    this.spinner.show();
    this._registerService.registerDetaTareosOp(data).subscribe(
      (response: any) => {
        this.getTareoOp();
        let i = 0;
        this.conductores.forEach(conductor => {
          this.conductores[i].seleccion = 0;
          i++;
        });
        this.seleccionConductor();
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async updateDetaTareoOp(i, deta) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (deta.idDetatareo === 0) {
      let data = {
        idTareo: this.idTareo,
        idConductor: this.detaTareo[i].idConductor,
        fecha: deta.fecha,
        turno1: deta.turno1,
        turno2: deta.turno2,
        turno3: deta.turno3,
        idUsuario: this._userService.user.ID_USER
      }
      this.disabled = true;
      this._registerService.registerDetaTareoOp(data).subscribe(
        (response: any) => {
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo1'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP1;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo2'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP2;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo3'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP3;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo1'] = response.detaTareoOperaciones.CODIGO1;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo2'] = response.detaTareoOperaciones.CODIGO2;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo3'] = response.detaTareoOperaciones.CODIGO3;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo3'] = response.detaTareoOperaciones.CODIGO3;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['idDetatareo'] = response.detaTareoOperaciones.ID_DETA_TAREO_OP;
          this.disabled = false;
        },
        error => {
          this.getTareoOp();
          this.disabled = false;
        }
      );
    }

    if (deta.idDetatareo > 0) {
      let data = {
        idDetaTareo: deta.idDetatareo, 
        turno1: deta.turno1,
        turno2: deta.turno2,
        turno3: deta.turno3,
        idUsuario: this._userService.user.ID_USER
      }
      this.disabled = true;
      this._registerService.updateDetaTareoOp(data).subscribe(
        (response: any) => {
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo1'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP1;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo2'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP2;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['motivo3'] = response.detaTareoOperaciones.DS_MOTIVO_TAREO_OP3;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo1'] = response.detaTareoOperaciones.CODIGO1;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo2'] = response.detaTareoOperaciones.CODIGO2;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo3'] = response.detaTareoOperaciones.CODIGO3;
          this.detaTareo[i][response.detaTareoOperaciones.DIA]['codigo3'] = response.detaTareoOperaciones.CODIGO3;
          this.disabled = false;
        },
        error => {
          this.getTareoOp();
          this.disabled = false;
        }
      );
    }
  }

  // async deleteDetaTareoOp(idConductor) {
  //   let token = await this._userService.validarToken();
  //   if (!token) {
  //     return;
  //   }

  //   this._registerService.deleteDetaTareoOp(this.idTareo, idConductor).subscribe(
  //     (response: any) => {
  //       this.getTareoOp();
  //     }
  //   );
  // }

  async deleteTareoOp() {
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
        this.spinner.show();
        this._registerService.deleteTareoOp(this.idTareo).subscribe(
          (response: any) => {
            // this.getTareoOp();
            this._router.navigate(['/tareos-operaciones']);
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
      } 
    });
  }

  async deleteDetaTareoOp(idConductor) {
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
        this.spinner.show();
        this._registerService.deleteDetaTareoOp(this.idTareo, idConductor).subscribe(
          (response: any) => {
            this.getTareoOp();
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
      } 
    });
  }

  verConductores(valor) {
    this.vistaConductor = valor;
  }

  seleccionConductor() {
    let cantidad = 0
    this.conductores.forEach(conductor => {
      if (conductor.seleccion) {          
        cantidad++;
      }
    });
    this.cantConductoresSelec = cantidad;
  }

  limpiar() {
  }

  async tableToExcel(tableID, filename = ''){ 
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }  
    if (this.totalRegistros === 0) {
      return;
    }
    // const tareo = await this.actualizarTareo();
    // if (tareo) {
      this.spinner.show();
      // setTimeout(() => {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');        
        // Specify file name
        filename = filename?filename + ' ' + this.tareoOperaciones.tareoOperaciones.NB_ZONA_COND + ' ' + this.nroMes + '.' + this.year + '.xls':'excel_data';
        // Create download link element
        downloadLink = document.createElement("a");        
        document.body.appendChild(downloadLink);        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });            
            navigator.msSaveOrOpenBlob( blob, filename);
            this.spinner.hide();
        }else{
           
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;        
            // Setting the file name
            downloadLink.download = filename;            
            //triggering the function
            downloadLink.click();
            this.spinner.hide();
        }
      // }, 3000);    
    // } 
  }

  actualizarTareo() {
    this.spinner.show();
    return new Promise(resolve => {
      this._registerService.getTareoOp(this.idTareo).subscribe(
        (response: any) => {
          this.tareoOperaciones = response;
          this.dias = response.diasMes;
          this.detaTareo = response.tareoOperacionesTotal;
          this.totalRegistros = response.tareoOperacionesTotal.length;
          this.year = response.tareoOperaciones.ANIO;
          this.nroMes = response.tareoOperaciones.MES;
          this.idZona = response.tareoOperaciones.ID_ZONA;
          this.cantTurnos =  response.tareoOperaciones.CANT_TURNOS;
          resolve(this.tareoOperaciones);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    });
  }
}
