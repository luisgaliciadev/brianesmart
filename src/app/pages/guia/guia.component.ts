import { Component, OnInit, ɵConsole } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Guia } from 'src/app/models/guia.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.component.html',
  styles: [
  ]
})
export class GuiaComponent implements OnInit {

  tipoServicio = '';
  producto = '';
  cliente = '';
  origen = '';
  destino = '';
  guia: Guia = new Guia('','','','',0,0,0,0,0,0,'','','','','',0,0,0,'','','','SERVICIO PROPIO',0);
  idConductor = '';
  nombreConductor = '';
  tracto = '';
  remolque = '';
  loading = true;
  ordenes = [];
  date = new Date();
  mes;
  dia;
  fhEmision = '';
  horaEmision = '';
  minEmision = '';
  fhTraslado = '';
  horaTraslado = '';
  minTraslado = '';
  fhFin = '';
  horaFin = '';
  minFin = '';
  registrando = false;
  modificar = false;
  tipoEmpresa = false;
  ruc = ''
  nombreCliente = ''


  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) 
  { 
    this.guia.ID_USUARIO_BS = this._userService.user.ID_USER;
  }

  ngOnInit(): void {
    // this._userService.permisoModule(this._router.url);
    this._route.params.forEach((params: Params) => {
      this.guia.ID_GUIA = params.id;
      if (this.guia.ID_GUIA > 0) {
        this.modificar = true;
        this.getGuia();
        this.getOrdenesServicio();
      } else {
        // this.loading = false;
        this.getOrdenesServicio();
      }
    });

    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();
    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }
    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }
    this.fhEmision = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhTraslado = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhFin = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  getGuia() {
    this._registerService.getGuia(this.guia.ID_GUIA, this._userService.user.ID_USER).subscribe(
      (response: any) => {
        this.guia = response.guia;
        var arrayFhemision = this.guia.FECHA.split('T');
        var arrayHoraEmision = arrayFhemision[1].split(':');
        this.fhEmision = arrayFhemision[0];
        this.horaEmision = arrayHoraEmision[0];
        this.minEmision = arrayHoraEmision[1];

        var arrayFhTraslado = this.guia.FH_TRASLADO.split('T');
        var arrayHoraTraslado = arrayFhTraslado[1].split(':');
        this.fhTraslado = arrayFhTraslado[0];
        this.horaTraslado = arrayHoraTraslado[0];
        this.minTraslado = arrayHoraTraslado[1];

        if (this.guia.FECHA_HORA_FIN) {
          var arrayFhFin = this.guia.FECHA_HORA_FIN.split('T');
        var arrayHoraFin = arrayFhFin[1].split(':');
        this.fhFin = arrayFhFin[0];
        this.horaFin = arrayHoraFin[0];
        this.minFin = arrayHoraFin[1];
        }

        var arrayCorrelativo = this.guia.CORRELATIVO.split('-');
        this.guia.CORRELATIVO = arrayCorrelativo[1];

        console.log(this.guia);
        if (this.guia.ID_EMPRESA > 0) {
          console.log('aqui');
          this.tipoEmpresa = true;
          this.getCliente(this.guia.ID_EMPRESA);
        }
      }
    );
  }

  registerGuia(data) {    
    
    this.registrando = true;
    this.guia.FECHA = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;
    // this.guia.FH_TRASLADO = data.fhTraslado + ' ' + data.horaTraslado + ':' + data.minTraslado;
    this.guia.FH_TRASLADO = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;

    if (this.tipoServicio != 'ALQUILER') {
      this.guia.FECHA_HORA_FIN = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;
    } else {
      this.guia.FECHA_HORA_FIN = data.fhFin + ' ' + data.horaFin + ':' + data.minFin;
    }
   
    var fechaEmision = new Date(this.guia.FECHA);
    var fechaFin = new Date(this.guia.FECHA_HORA_FIN);
    var horas =  parseFloat(parseFloat(String((fechaFin.getTime() - fechaEmision.getTime()) / 3600000)).toFixed(2)); 
    this.guia.TIEMPO_VIAJE = horas;

    if (this.tipoServicio === 'ALQUILER' && this.guia.TIEMPO_VIAJE <= 0) {
      Swal.fire('Mensaje', 'Error en fecha/hora de emisión ó fin, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    }

    if (this.guia.PESO_BRUTO <= 0 || this.guia.PESO_TARA <= 0) {
      Swal.fire('Mensaje', 'Error en peso bruto ó peso tara, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.PESO_NETO <= 0) {
      Swal.fire('Mensaje', 'Error en peso neto, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.ID_TRACTO == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una placa de tracto correcta.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.ID_REMOLQUE == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una placa de remolque correcta.', 'warning');
      this.registrando = false;
      return;
    } 

    if(this.tipoEmpresa && this.guia.ID_EMPRESA == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una empresa subcontratada.', 'warning');
      this.registrando = false;
      return;
    } 

    // console.log(this.guia);
    // return;  

    this._registerService.registerGuia(this.guia).subscribe(
      (response: any) => {
        if (response.guia) {
          this.fhEmision = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
          this.fhTraslado = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
          this.fhFin = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;         
          this.horaEmision = '';
          this.minEmision = '';
          this.horaTraslado = '';
          this.minTraslado = '';
          this.horaFin = '';
          this.minFin = '';
          this.idConductor = '';
          this.nombreConductor = '';
          this.guia.ID_CONDUCTOR = 0;
          this.tracto = '';
          this.remolque = '';
          this.guia.ID_TRACTO = 0;
          this.guia.ID_REMOLQUE = 0;
          this.guia.PESO_BRUTO = 0;
          this.guia.PESO_TARA = 0;
          this.guia.PESO_NETO = 0;
          this.guia.NRO_PERMISO = '';
          this.guia.NRO_GUIA_CLIENTE = '';
          // this.guia.SERIAL = '';
          this.guia.CORRELATIVO = '';
          this.guia.OBSERVACION = ''
          this.guia.ID_EMPRESA = 0;
          this.guia.TIPO_EMPRESA = 'SERVICIO PROPIO';
          this.tipoEmpresa = false;
          this.ruc = ''
          this.nombreCliente = ''
          this.registrando = false;
          // document.getElementById("fhEmision").focus(); 
        }        
      },
      (error: any) => {
        this.registrando = false;
      }
    );
  }

  updateGuia(data) {      
    this.registrando = true;
    this.guia.FECHA = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;
    // this.guia.FH_TRASLADO = data.fhTraslado + ' ' + data.horaTraslado + ':' + data.minTraslado;
    this.guia.FH_TRASLADO = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;

    if (this.tipoServicio != 'ALQUILER') {
      this.guia.FECHA_HORA_FIN = data.fhEmision + ' ' + data.horaEmision + ':' + data.minEmision;
    } else {
      this.guia.FECHA_HORA_FIN = data.fhFin + ' ' + data.horaFin + ':' + data.minFin;
    }
   
    var fechaEmision = new Date(this.guia.FECHA);
    var fechaFin = new Date(this.guia.FECHA_HORA_FIN);
    var horas =  parseFloat(parseFloat(String((fechaFin.getTime() - fechaEmision.getTime()) / 3600000)).toFixed(2)); 
    this.guia.TIEMPO_VIAJE = horas;

    if (this.tipoServicio === 'ALQUILER' && this.guia.TIEMPO_VIAJE <= 0) {
      Swal.fire('Mensaje', 'Error en fecha/hora de emisión ó fin, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    }

    if (this.guia.PESO_BRUTO <= 0 || this.guia.PESO_TARA <= 0) {
      Swal.fire('Mensaje', 'Error en peso bruto ó peso tara, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.PESO_NETO <= 0) {
      Swal.fire('Mensaje', 'Error en peso neto, por favor verificar.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.ID_TRACTO == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una placa de tracto correcta.', 'warning');
      this.registrando = false;
      return;
    } 

    if (this.guia.ID_REMOLQUE == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una placa de remolque correcta.', 'warning');
      this.registrando = false;
      return;
    } 

    if(this.tipoEmpresa && this.guia.ID_EMPRESA == 0) {
      Swal.fire('Mensaje', 'Disculpe, debe ingresar una empresa subcontratada.', 'warning');
      this.registrando = false;
      return;
    } 
 
    this._registerService.updateGuia(this.guia).subscribe(
      (response: any) => {
        if (response.guia) {
          this.registrando = false;
        }        
      },
      (error: any) => {
        this.registrando = false;
      }
    );
  }

  deleteGuia() {
    this._registerService.deleteGuia(this.guia.ID_GUIA).subscribe(
      (response: any) => {
        console.log(response);
        if(response) {
         this._router.navigate(['/guias']);
        }
      }
    );
  }

  getCliente(ruc) {
    this.guia.ID_EMPRESA = 0;
    this._registerService.getCliente(ruc).subscribe(
      (response: any) => {
        this.guia.ID_EMPRESA = response.cliente.ID_CLIENTE;
        this.nombreCliente = response.cliente.RAZON_SOCIAL;
        this.ruc = response.cliente.RUC;
        if(this.tipoEmpresa) {
          this.guia.TIPO_EMPRESA = 'SUBCONTRATADO'
        } else {
          this.guia.TIPO_EMPRESA = 'SERVICIO PROPIO'
        }
      }
    );
  }

  getOrdenesServicio() {
    this.loading = true;
    this._registerService.getOrdenServicio(this._userService.user.ID_USER).subscribe(
      (response: any) => {         
        this.ordenes = response.ordenesServicio;      
        if (this.guia.ID_GUIA > 0) {
          this.datosOrden(this.guia.ID_ORDEN_SERVICIO);
          this.getConductor(this.guia.IDEN_CONDUCTOR);
          this.getVehiculo(this.guia.PLACA_TRACTO,1);
          this.getVehiculo(this.guia.PLACA_REMOLQUE,2);
        }
        this.loading = false;
      },
      (error: any) => {
          this.ordenes = [];
      }
    );
  }

  datosOrden(idOden) {
    const orden = this.ordenes.find( orden => orden.ID_ORDEN_SERVICIO == idOden );
    this.tipoServicio = orden.DS_TIPO_SERVICIO;
    this.producto = orden.DS_PRODUCTO;
    this.cliente = orden.RAZON_SOCIAL;
    this.origen = orden.DS_ORI_DEST;
    this.destino = orden.DESTINO;
    this.guia.SERIAL = orden.SERIAL_GUIAS;
  }

  getConductor(id) {
    if (id === '') {
      return;
    }
    this._registerService.getConductor(id).subscribe(
      (response: any) => {
        this.idConductor = response.conductor.ID_Chofer;
        this.nombreConductor = response.conductor.Nombre;
        this.guia.ID_CONDUCTOR = response.conductor.ID_CONDUCTOR
      },
      error => {
        this.idConductor = '';
        this.nombreConductor = '';
        this.guia.ID_CONDUCTOR = 0;
      }
    );
  }

  getVehiculo(placa, tipo) {
    if (placa === '') {
      return;
    }
    this._registerService.getVehiculo(placa, tipo).subscribe(
      (response: any) => {
        if(tipo == 1) {
          this.tracto = response.vehiculo.PLACA;
          this.guia.ID_TRACTO = response.vehiculo.ID_VEHICULO;
        } else {
          this.remolque = response.vehiculo.PLACA;
          this.guia.ID_REMOLQUE = response.vehiculo.ID_VEHICULO;
        }
      },
      error => {
        if(tipo == 1) {
          this.guia.ID_TRACTO = 0;
        } else {
          this.guia.ID_REMOLQUE = 0;
        }
      }
    );
  }

  pesos () {
    this.guia.PESO_NETO = this.guia.PESO_BRUTO - this.guia.PESO_TARA;
  }

  idVehiculos(tipo) {
    if (tipo == 1) {
      this.guia.ID_TRACTO = 0;
    } else {
      this.guia.ID_REMOLQUE = 0;
    }
  }

}
