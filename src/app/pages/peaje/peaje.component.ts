import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Guia } from 'src/app/models/guia.model';
import Swal from 'sweetalert2';
import { Peaje } from 'src/app/models/peaje.model';
import { DetaPeaje } from 'src/app/models/detaPeaje.model';

@Component({
  selector: 'app-peaje',
  templateUrl: './peaje.component.html',
  styles: [
  ]
})
export class PeajeComponent implements OnInit {

  peaje: Peaje = new Peaje(0,0,0,0,'');
  idOrderSevicio = 0;
  idPeaje = 0;
  tipoServicio = '';
  producto = '';
  cliente = '';
  origen = '';
  destino = '';
  idConductor = '';
  nombreConductor = '';
  loading = true;
  ordenes = [];
  date = new Date();
  mes;
  dia;
  registrando = false;
  modificar = false;
  conductores = []
  montoPeaje = 0;
  fechaPeaje = '';

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) 
  { 
    
  }

  ngOnInit(): void {
    // this._userService.permisoModule(this._router.url);
    this._route.params.forEach((params: Params) => {
      this.peaje.ID_PEAJE = params.id;
      if (this.peaje.ID_PEAJE > 0) {
        this.modificar = true;
        this.getOrdenesServicioAll();
      } else {
        this.getOrdenesServicioAll();
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
    
  }

  registerPeaje() {   
    console.log(this.peaje);
    this.peaje.ID_USUARIO_BS = this._userService.user.ID_USER;
    let peajes = {
      peaje: this.peaje,
      detaPeaje: this.conductores
    };
    console.log(peajes);
    this._registerService.registerPeaje(peajes).subscribe(
      (response: any) => {
        console.log(response);
        this._router.navigate(['/peajes']);
      }
    );
    
  }

  getOrdenesServicioAll() {
    this.loading = true;
    this._registerService.getOrdenServicioAll(this._userService.user.ID_USER).subscribe(
      (response: any) => {         
        this.ordenes = response.ordenesServicio;  
        console.log(this.ordenes); 
        // this.datosOrden(this.idOrderSevicio);   
        
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
  }

  getConductor(id) {
    if (id === '') {
      return;
    }
    this._registerService.getConductor(id).subscribe(
      (response: any) => {
        this.idConductor = response.conductor.ID_Chofer;
        this.nombreConductor = response.conductor.Nombre;
      },
      error => {
        this.idConductor = '';
        this.nombreConductor = '';
      }
    );
  }

  agregarConductor() {
    
    if ( this.peaje.ID_ORDEN_SERVICIO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una orden de servicio', 'warning');
      return;
    }

    if ( this.nombreConductor === '' ||  this.idConductor === '') {
      Swal.fire('Mensaje', 'Debe seleccionar un conductor', 'warning');
      return;
    }

    if ( this.montoPeaje == 0 ||  this.fechaPeaje === '') {
      Swal.fire('Mensaje', 'Existen campos vacios', 'warning');
      return;
    }

    const resultado = this.conductores.find( iden => iden.dni === this.idConductor );
    if(resultado) {
      Swal.fire('Mensaje', 'El conducto ya esta agregado en la lista', 'warning');
      return;
    }

    this.conductores.push({
      nombre: this.nombreConductor,
      dni: this.idConductor,
      monto: this.montoPeaje,
      fecha: this.fechaPeaje,
      peaje: '',
      idOrderSevicio: this.idOrderSevicio
    });

    var montoTotal = 0;
    this.conductores.forEach(function (peaje) { 
      montoTotal = montoTotal + peaje.monto;
    });
    this.peaje.MONTO_TOTAL = montoTotal;
    this.peaje.CANT_REGISTROS = this.conductores.length;

    console.log('this.peaje: ', this.peaje);

    this.nombreConductor = '';
    this.idConductor = '';
    this.montoPeaje = 0;
    this.fechaPeaje = ''
  }

  eliminarConductor(i) {
    this.conductores.splice(i, 1);
  }

}
