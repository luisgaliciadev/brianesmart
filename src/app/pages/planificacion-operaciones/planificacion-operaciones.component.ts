import { Component, OnInit} from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import {saveAs} from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-planificacion-operaciones',
  templateUrl: './planificacion-operaciones.component.html',
  styles: [
  ]
})
export class PlanificacionOperacionesComponent implements OnInit {
  idOrderSevicio = 0;
  ordenes = [];
  loading = false;
  tipoServicio = '';
  producto = '';
  cliente = '';
  origen = '';
  destino = '';
  conductores = [];
  tractos = [];
  remolques = [];
  planificaciones = [];
  demandas = [];
  demandasTotal = [];
  registrando = false;
  idRecursos = 1;
  idPlanificacion = 0;
  fechaPlanificacion = '';
  toneladas = 0;
  viajesEstimados = 0;
  unidadesEstimadas = 0;
  estadoOs = 0;
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  zonasConductor: any[] = [];
  idZona = 1;
  buscarDemada = '';
  buscarConductor = '';
  buscarTracto = '';
  buscarRemolque = '';
  
  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
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
    this.getConductores();
    this.getTractos();
    this.getRemolques();
    this.getZonasConcutor();
  }

  async getOrdenServicioPlanificacion() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    this.spinner.show();
    this._registerService.getOrdenServicioPlanificacion(this.fhDesde, this.fhHasta, this.idZona).subscribe(
      (response: any) => {        
        this.buscarDemada = '';
        this.buscarConductor = '';
        this.buscarTracto = '';
        this.buscarRemolque = '';
        this.ordenes = response.ordenesServicio;  
        this.demandas = response.demandas;
        this.getPlanificacionesDeta();
        this.spinner.hide();
      },
      (error: any) => {
          this.spinner.hide();
      }
    );
  }

  getZonasConcutor() {
    this.spinner.show();
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
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

  getTractos() {
    this.spinner.show();
    this._registerService.getUnidadesDisponibles(1).subscribe(
      (response: any) => {
        this.tractos = response.unidades;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getRemolques() {
    this.spinner.show();
    this._registerService.getUnidadesDisponibles(2).subscribe(
      (response: any) => {
        this.remolques = response.unidades;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  datosOrden(idOrden) {   
    this.demandas = [];
    const orden = this.ordenes.find( orden => orden.ID_ORDEN_SERVICIO == idOrden );
    if (orden) {
      this.tipoServicio = orden.DS_TIPO_SERVICIO;
      this.producto = orden.DS_PRODUCTO;
      this.cliente = orden.RAZON_SOCIAL;
      this.origen = orden.DS_ORI_DEST;
      this.destino = orden.DESTINO;
      this.toneladas = orden.TONELADAS;
      this.viajesEstimados = orden.VIAJES_ESTIMADOS;
      this.unidadesEstimadas = orden.UNIDADES_ESTIMADAS;
      this.estadoOs =  orden.ESTADO;
      
      let guiasTotal = 0;
      if (orden.CANTIDAD_GUIAS_TOTAL) {
        guiasTotal = orden.CANTIDAD_GUIAS_TOTAL;
      }
      let i;
      for (i = 0; i < orden.VIAJES_ESTIMADOS - guiasTotal; i++) {
        this.demandas.push({
          id: i+1,
          origen: orden.DS_ORI_DEST,
          destino: orden.DESTINO,
          seleccion : false
        });
      }
    } else {
      this.tipoServicio = '';
      this.producto = '';
      this.cliente = '';
      this.origen = '';
      this.destino = '';
      this.demandas = [];
      this.toneladas = 0;
      this.viajesEstimados = 0;
      this.unidadesEstimadas = 0;
    }
  }

  getPlanificacionOP() {
    this.spinner.show();
    this._registerService.getPlanificacionOP(this.idPlanificacion).subscribe(
      (response: any) => {
        this.idOrderSevicio = response.planificacionOp.ID_ORDEN_SERVICIO;
        this.fechaPlanificacion = response.planificacionOp.FECHA_CAMBIO;
        this.getOS(response.planificacionOp.ID_ORDEN_SERVICIO);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getPlanificacionesDeta() {
    this.spinner.show();
    this._registerService.getPlanificacionesDeta(this.fhDesde,this.fhDesde,this.idZona).subscribe(
      (response: any) => {
        this.planificaciones = response.planificacionesDeta;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getOS(idOs) {
    this.spinner.show();
    this._registerService.getOS(idOs).subscribe(
      (response: any) => {
        this.ordenes.push({
          CANTIDAD_GUIAS_TOTAL: response.ordenServicio.CANTIDAD_GUIAS_TOTAL,
          CORRELATIVO: response.ordenServicio.CORRELATIVO,
          DESTINO: response.ordenServicio.DESTINO,
          DS_NAVE: response.ordenServicio.DS_NAVE,
          DS_ORI_DEST: response.ordenServicio.DS_ORI_DEST,
          DS_PRODUCTO: response.ordenServicio.DS_PRODUCTO,
          DS_TIPO_ACOPLE: response.ordenServicio.DS_TIPO_ACOPLE,
          DS_TIPO_CARGA: response.ordenServicio.DS_TIPO_CARGA,
          DS_TIPO_SERVICIO: response.ordenServicio.DS_TIPO_SERVICIO,
          ID_ORDEN_SERVICIO: response.ordenServicio.ID_ORDEN_SERVICIO,
          NRO_LOTE: response.ordenServicio.NRO_LOTE,
          PORCENTAJE: response.ordenServicio.PORCENTAJE,
          RAZON_SOCIAL: response.ordenServicio.RAZON_SOCIAL,
          RUC: response.ordenServicio.RUC,
          SERIAL_GUIAS: response.ordenServicio.SERIAL_GUIAS,
          TONELADAS: response.ordenServicio.TONELADAS,
          TONELADAS_RESTANTE: response.ordenServicio.TONELADAS_RESTANTE,
          TOTAL_PESO_NETO: response.ordenServicio.TOTAL_PESO_NETO,
          UNIDADES_ESTIMADAS: response.ordenServicio.UNIDADES_ESTIMADAS,
          VIAJES_ESTIMADOS: response.ordenServicio.VIAJES_ESTIMADOS,
          ESTADO: response.ordenServicio.ESTADO
        });

        if (response.ordenServicio.ESTADO === 2) {
          let guiasTotal = 0;
          this.demandas = [];
          if (response.ordenServicio.CANTIDAD_GUIAS_TOTAL) {
            guiasTotal = response.ordenServicio.CANTIDAD_GUIAS_TOTAL;
          }
          let i;
          for (i = 0; i < response.ordenServicio.VIAJES_ESTIMADOS - guiasTotal; i++) {
            this.demandas.push({
              id: i+1,
              origen: response.ordenServicio.DS_ORI_DEST,
              destino: response.ordenServicio.DESTINO,
              seleccion : false
            });
          }
        }
        
        this.idOrderSevicio = response.ordenServicio.ID_ORDEN_SERVICIO;
        this.tipoServicio = response.ordenServicio.DS_TIPO_SERVICIO;
        this.producto = response.ordenServicio.DS_PRODUCTO;
        this.cliente = response.ordenServicio.RAZON_SOCIAL;
        this.origen = response.ordenServicio.DS_ORI_DEST;
        this.destino = response.DESTINO;
        this.toneladas = response.ordenServicio.TONELADAS;
        this.viajesEstimados = response.ordenServicio.VIAJES_ESTIMADOS;
        this.unidadesEstimadas = response.ordenServicio.UNIDADES_ESTIMADAS;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async registerPlanificacion() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (this.idOrderSevicio == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una orden de servicio', 'warning');
      return;
    }
    this.spinner.show();
    let planificacion = {
      idOrdenServicio: this.idOrderSevicio,
      idUsuario: this._userService.user.ID_USER
    };
    this._registerService.registerPlanifiacionOp(planificacion).subscribe(
      (response: any) => {
        this._router.navigate(['/planificacion-operaciones']);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  seleccion(items) { 
    let i;
    i = items - 1;   
    let j;
    for (j = 0; j < this.demandas.length; j++) {
      this.demandas[j].seleccion = false;
    }
    this.demandas[i].seleccion = true;
  }

  seleccionConductor(items) {  
    let i;
    i = items - 1;
    let j;
    for (j = 0; j < this.conductores.length; j++) {
      this.conductores[j].seleccion = false;
    }
    this.conductores[i].seleccion = true;
  }

  seleccionTracto(items) { 
    let i;
    i = items - 1;  
    let j;
    for (j = 0; j < this.tractos.length; j++) {
      this.tractos[j].seleccion = false;
    }
    this.tractos[i].seleccion = true;
  }

  seleccionRemolque(items) {    
    let i;
    i = items - 1;
    let j;
    for (j = 0; j < this.remolques.length; j++) {
      this.remolques[j].seleccion = false;
    }
    this.remolques[i].seleccion = true;
  }

  recursos(id) {
    this.idRecursos = id;
  }

  reestablecerListas() {
    let j;
    for (j = 0; j < this.demandas.length; j++) {
      this.demandas[j].seleccion = false;
    }

    for (j = 0; j < this.conductores.length; j++) {
      this.conductores[j].seleccion = false;
    }

    for (j = 0; j < this.tractos.length; j++) {
      this.tractos[j].seleccion = false;
    }

    for (j = 0; j < this.remolques.length; j++) {
      this.remolques[j].seleccion = false;
    }
  }

  async agregarRegistroPlanificacion() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let idConductor = 0;
    let idTracto = 0;
    let idRemolque = 0;
    let idDemanda = 0;
    let idOrdenServicio = 0

    this.demandas.forEach(function (demanda) {
      if (demanda.seleccion) {
        idDemanda = demanda.id;
        idOrdenServicio = demanda.idOrdenServicio
        
      }
    });

    this.conductores.forEach(function (conductor) {
      if (conductor.seleccion) {
        idConductor = conductor.ID_CONDUCTOR;
      }
    });

    this.tractos.forEach(function (tracto) {
      if (tracto.seleccion) {
        idTracto = tracto.ID_VEHICULO;
      }
    });

    this.remolques.forEach(function (remolque) {
      if (remolque.seleccion) {
        idRemolque = remolque.ID_VEHICULO;
      }
    });

    if (idDemanda === 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un registro en la demanda', 'warning');
      return;
    }

    if (idConductor === 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un conductor', 'warning');
      return;
    }

    if (idTracto === 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un tracto', 'warning');
      return;
    }

    if (idRemolque === 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un remolque', 'warning');
      return;
    }

    let dataPlanificacion = {
      idOrdenServicio,
      idTracto,
      idRemolque,
      idConductor,
      idUsuario: this._userService.user.ID_USER,
      fecha: this.fhDesde
    };
    document.getElementById("btnConductor").click();
    this.spinner.show();
    this._registerService.registerPlanifiacionOpDeta(dataPlanificacion).subscribe(
      (response: any) => {
        this.demandas.splice(0, 1);
        this.reestablecerListas();
        this.getPlanificacionesDeta();
        this.buscarDemada = '';
        this.buscarConductor = '';
        this.buscarTracto = '';
        this.buscarRemolque = '';
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }

  async deletePlanificacion() {
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
        this._registerService.deletePlanificacionOp(this.idPlanificacion, this.idOrderSevicio).subscribe(
          (response: any) => {
            this.spinner.hide();
            this._router.navigate(['/planificaciones-op']);
          },
          (error: any) => {
            this.spinner.hide();
          }
        );
      } 
    });
  }

  async deletePlanificacionDeta(id) {
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
        this._registerService.deletePlanificacionOpDeta(id).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.getOrdenServicioPlanificacion()
          },
          (error: any) => {
            this.spinner.hide();
          }
        );
      } 
    });
  }

  async updateFechaPlanificacionGuia(i) {    
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if(this.planificaciones[i].FG_PLANIFICADO) { 
      if (this.planificaciones[i].FECHA_INICIO_VIAJE === '' || !this.planificaciones[i].FECHA_INICIO_VIAJE) {
        Swal.fire('Mensaje', 'Debe ingresar la fecha de inicio de viaje.', 'warning');
        return;
      }

      if (this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE === '' || !this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE) {
        Swal.fire('Mensaje', 'Debe ingresar la hora de inicio de viaje.', 'warning');
        return;
      }

     
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0, 2)) > 23 || parseInt(this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(2)) > 59 || this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.length < 4)  {
        Swal.fire('Mensaje', 'Formato incorrecto en horas de inicio de viaje.', 'warning');
        return;
      }

      if (this.planificaciones[i].FECHA_LLEGADA_PC === '' || !this.planificaciones[i].FECHA_LLEGADA_PC) {
        Swal.fire('Mensaje', 'Debe ingresar la fecha de llegada al punto de carga.', 'warning');
        return;
      }

      if (this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC === '' || !this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC) {
        Swal.fire('Mensaje', 'Debe ingresar la hora de llegada al punto de carga', 'warning');
        return;
      }

      if (parseInt(this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0, 2)) > 23 || parseInt(this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(2)) > 59 || this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.length < 4)  {
        Swal.fire('Mensaje', 'Formato incorrecto en hora de llegada al punto de carga.', 'warning');
        return;
      }

      if (this.planificaciones[i].FECHA_FIN_VIAJE) {
        if (parseInt(this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0, 2)) > 23 || parseInt(this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(2)) > 59 || this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.length < 4)  {
          Swal.fire('Mensaje', 'Formato incorrecto en hora de fin de viaje.', 'warning');
          return;
        }
      }
     
      let fhFinViaje = null;

      if (this.planificaciones[i].FECHA_FIN_VIAJE) {
        if (this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE) {
          fhFinViaje = this.planificaciones[i].FECHA_FIN_VIAJE + ' ' + this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0, 2) + ':' + this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(2);
        }
      }

      let dataGuia = {
        idGuia: this.planificaciones[i].ID_GUIA,
        fhInicioViaje: this.planificaciones[i].FECHA_INICIO_VIAJE + ' ' + this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0, 2) + ':' + this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(2),
        fhLlegadaPc: this.planificaciones[i].FECHA_LLEGADA_PC + ' ' + this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0, 2) + ':' + this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(2),
        idUsuario: this._userService.user.ID_USER,
        fhFinViaje
      }

      this.spinner.show();
      this._registerService.updateFechaPlanificacionGuia(dataGuia).subscribe(
        (response: any) => {
          this.getConductores();
          this.getTractos();
          this.getRemolques();
          this.getPlanificacionesDeta();
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    }
  }

  validarHora(i) { 
    if (this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE) {
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0, 2))) {      
        if (this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0, 2) > 23) {
          this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE = this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0,0) + '23';
        }
      }

      if (parseInt(this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(2))) {      
        if (parseInt(this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(2)) > 59) {
          this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE = this.planificaciones[i].HORA_MIN_FH_INICIO_VIAJE.substring(0,2) + '59';
        }
      }
    }


    if (this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC) {
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0, 2))) {      
        if (this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0, 2) > 23) {
          this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC = this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0,0) + '23';
        }
      }
  
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(2))) {      
        if (parseInt(this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(2)) > 59) {
          this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC = this.planificaciones[i].HORA_MIN_FH_LLEGADA_PC.substring(0,2) + '59';
        }
      }
    }
    
    if (this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE) { 
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0, 2))) {      
        if (this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0, 2) > 23) {
          this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE = this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0,0) + '23';
        }
      }
  
      if (parseInt(this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(2))) {      
        if (parseInt(this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(2)) > 59) {
          this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE = this.planificaciones[i].HORA_MIN_FH_FIN_VIAJE.substring(0,2) + '59';
        }
      }
    }
  }
}