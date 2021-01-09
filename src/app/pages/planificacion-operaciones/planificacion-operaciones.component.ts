import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { Peaje } from 'src/app/models/peaje.model';
import {saveAs} from 'file-saver';

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
  registrando = false;
  idRecursos = 1;
  idPlanificacion = 0;
  fechaPlanificacion = '';
  toneladas = 0;
  viajesEstimados = 0;
  unidadesEstimadas = 0;
  estadoOs = 0;
  
  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {    
    this._route.params.forEach((params: Params) => {
      this.idOrderSevicio = 0;
      this.idPlanificacion = parseInt(params.id);
      this.getConductores();
      this.getTractos();
      this.getRemolques();
      this.getOrdenesServicioAll();
    });
  }

  getOrdenesServicioAll() {
    this.loading = true;
    this._registerService.getOrdenServicioPlanificacion().subscribe(
      (response: any) => {        
        this.ordenes = response.ordenesServicio;  
        if (this.idPlanificacion > 0) {
          this.getPlanificacionOP();
        } else {
          this.datosOrden( this.idOrderSevicio);
        }
        this.loading = false;
      },
      (error: any) => {
          this.loading = false;
          this.ordenes = [];
      }
    );
  }

  getConductores() {
    this.loading = true;
    this._registerService.getConductoresDisponibles().subscribe(
      (response: any) => {
        this.conductores = response.conductores;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  getTractos() {
    this.loading = true;
    this._registerService.getUnidadesDisponibles(1).subscribe(
      (response: any) => {
        this.tractos = response.unidades;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  getRemolques() {
    this.loading = true;
    this._registerService.getUnidadesDisponibles(2).subscribe(
      (response: any) => {
        this.remolques = response.unidades;
        this.loading = false;
      },
      error => {
        this.loading = false;
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
    this.loading = true;
    this._registerService.getPlanificacionOP(this.idPlanificacion).subscribe(
      (response: any) => {
        this.idOrderSevicio = response.planificacionOp.ID_ORDEN_SERVICIO;
        this.fechaPlanificacion = response.planificacionOp.FECHA_CAMBIO;
        this.getOS(response.planificacionOp.ID_ORDEN_SERVICIO);
        this.getPlanificacionDeta();
      },
      error => {
        this.loading = false;
      }
    );
  }

  getPlanificacionDeta() {
    this.loading = true;
    this._registerService.getPlanificacionDeta(this.idPlanificacion).subscribe(
      (response: any) => {
        this.planificaciones = response.planificacionDeta;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  getOS(idOs) {
    this.loading = true;
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
        this.loading = false;
      },
      error => {
        this.loading = false;
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
    this.registrando = true;
    let planificacion = {
      idOrdenServicio: this.idOrderSevicio,
      idUsuario: this._userService.user.ID_USER
    };
    this._registerService.registerPlanifiacionOp(planificacion).subscribe(
      (response: any) => {
        this._router.navigate(['/planificacion-operaciones', response.planifiacionOp.ID_PLANIFICACION_OP]);
        this.registrando = false;
      },
      error => {
        this.registrando = false;
      }
    );
  }

  seleccion(i) {    
    let j;
    for (j = 0; j < this.demandas.length; j++) {
      this.demandas[j].seleccion = false;
    }
    this.demandas[i].seleccion = true;
  }

  seleccionConductor(i) {    
    let j;
    for (j = 0; j < this.conductores.length; j++) {
      this.conductores[j].seleccion = false;
    }
    this.conductores[i].seleccion = true;
  }

  seleccionTracto(i) {    
    let j;
    for (j = 0; j < this.tractos.length; j++) {
      this.tractos[j].seleccion = false;
    }
    this.tractos[i].seleccion = true;
  }

  seleccionRemolque(i) {    
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
    this.demandas.splice(0, 1);
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

  agregarRegistroPlanificacion() {
    let idConductor = 0;
    let idTracto = 0;
    let idRemolque = 0;
    let idDemanda = 0;

    this.demandas.forEach(function (demanda) {
      if (demanda.seleccion) {
        idDemanda = demanda.id;
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
      idOrdenServicio: this.idOrderSevicio,
      idTracto,
      idRemolque,
      idConductor,
      idUsuario: this._userService.user.ID_USER
    };
    document.getElementById("btnConductor").click();
    this.registrando = true;
    this._registerService.registerPlanifiacionOpDeta(dataPlanificacion).subscribe(
      (response: any) => {
        this.reestablecerListas();
        this.registrando = false;
        this.getPlanificacionDeta();
      },
      (error: any) => {
        this.registrando = false;
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
        
        this.loading = true;
        this._registerService.deletePlanificacionOp(this.idPlanificacion, this.idOrderSevicio).subscribe(
          (response: any) => {
            this.loading = false;
            this._router.navigate(['/planificaciones-op']);
          },
          (error: any) => {
            this.loading = false;
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
        
        this.loading = true;
        this._registerService.deletePlanificacionOpDeta(id).subscribe(
          (response: any) => {
            this.loading = false;
            // this._router.navigate(['/planificacion-operaciones', this.idPlanificacion]);
            this.getOS(this.idOrderSevicio);
            this.getPlanificacionDeta();
          },
          (error: any) => {
            this.loading = false;
          }
        );
      } 
    });
  }

}
