import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Peaje } from 'src/app/models/peaje.model';
import { RegisterService, UserService } from 'src/app/services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-resumen-peaje',
  templateUrl: './resumen-peaje.component.html',
  styles: [
  ]
})
export class ResumenPeajeComponent implements OnInit {
  
  peaje: Peaje = new Peaje(0,0,0,0,'');
  conductores = [];
  idOrderSevicio = 0;
  idPeaje = 0;
  correlativo = '';
  tipoServicio = '';
  producto = '';
  cliente = '';
  origen = '';
  destino = '';
  peajesDeta = [];

  constructor(
    public _userService: UserService,
    public _route: ActivatedRoute,
    public _registerService: RegisterService
  ) { }

  ngOnInit(): void {
    init_plugins();
    this._route.params.forEach((params: Params) => {
      this.peaje.ID_PEAJE = params.id;
    });

    this.getPeaje();
  }

  getPeaje() {
    this._registerService.getPeaje(this.peaje.ID_PEAJE).subscribe(
      (response: any) => {
        // console.log(response);
        this.peaje.MONTO_TOTAL = response.peaje.MONTO_TOTAL;
        this.peaje.CANT_REGISTROS = response.peaje.CANT_REGISTROS;
        this.peaje.ID_ORDEN_SERVICIO = response.peaje.ID_ORDEN_SERVICIO;
        this.peaje.OBSERVACION = response.peaje.OBSERVACION;
        this.peaje.ESTATUS = response.peaje.ESTATUS;
        this.correlativo = response.detaPeajes[0].CORRELATIVO;
        this.tipoServicio = response.detaPeajes[0].DS_TIPO_SERVICIO;
        this.producto = response.detaPeajes[0].DS_PRODUCTO;
        this.cliente = response.detaPeajes[0].RAZON_SOCIAL;
        this.origen = response.detaPeajes[0].ORIGEN;
        this.destino = response.detaPeajes[0].DESTINO;
        var detaPeajes = [];
        response.detaPeajes.forEach(function (detalle) { 
            let fecha = detalle.FECHA.toString();
            let arrayFecha = fecha.split('-');
            fecha = arrayFecha[0] + '-' + arrayFecha[1] + '-' + arrayFecha[2].substring(0, 2);
            detaPeajes.push({
            idConductor: detalle.ID_CONDCUTOR,
            nombre: detalle.NOMBRE_APELLIDO,
            dni: detalle.IDENTIFICACION,
            monto: detalle.MONTO,
            fecha: fecha,
            peaje: '',
            idOrderSevicio: detalle.ID_ORDEN_SERVICIO,
            ID_DETA: detalle.ID_DETA_PEAJE,
            montoAbono: detalle.ABONO,
            montoSustentar: detalle.TOTAL_SUSTENTAR,
            depositado: detalle.FG_DEPOSITADO
          });
        });
        this.conductores = detaPeajes;
        console.log(response.detaPeajes);
      }
    );
  }

  activePrinter() {
    setTimeout(this.printer, 2000);
    this._userService.closeReport();
  }

  printer() {
    window.print();
  }

  toPrint() {
    var contenido= document.getElementById('report').innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
    window.close();
  }



}
