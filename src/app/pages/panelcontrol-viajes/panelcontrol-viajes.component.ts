import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import {saveAs} from 'file-saver';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-panelcontrol-viajes',
  templateUrl: './panelcontrol-viajes.component.html',
  styles: [
  ]
})
export class PanelcontrolViajesComponent implements OnInit {
  guias = [];
  desde = 0;
  hasta = 10;
  totalRegistros = 0;
  search = '';
  activeButton;
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  paginas = 1;
  pagina = 1;
  guiasTotal = [];
  zonasConductor = [];
  idZona = 0;
  motivosNoOp = [];
  idMotivoNoOp = 0;
  closeResult: string;
  iGuias = -1;
  nroFecha = 0;
  fd;
  fh;
  
  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    private _ngbModal: NgbModal,
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
    this.getZonasConcutor();
    this.getMotivoNoOp();
    // this.getGuias(this.search);    
  }

  getZonasConcutor() {
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
      }
    );
  }

  getMotivoNoOp() {
    this._registerService.getMotivoNoOp().subscribe(
      (response: any) => {
        this.motivosNoOp = response.motivos;
      }
    );
  }

  async getGuias(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idZona == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una zona.', 'warning');
      return;
    }
    if (search === '') {
      search = '0';
    }
    this.spinner.show();
    this._registerService.getGuiasControlViaje(search, this.fhDesde, this.fhHasta, 0, this.idZona).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 10;
        this.pagina = 1;
        this.totalRegistros = response.guias.length;
        this.guiasTotal = response.guias;
        this.guias = this.guiasTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 10);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.spinner.hide();
        this.activeButton = false;
      },
      (error: any) => {
        this.spinner.hide();
        this.activeButton = false;
      }
    );
  }

   // Exportar a excel listado de usuarios
  //  getGuiasExcel() {
  //   this._registerService.getGuiasExcel(this.search, this.fhDesde, this.fhHasta, 0).subscribe(
  //     (response: any) => {
  //       let fileBlob = response;
  //       let blob = new Blob([fileBlob], {
  //         type: "application/vnd.ms-excel"
  //       });
  //       // use file saver npm package for saving blob to file
  //       saveAs(blob, `ListadoGuias.xlsx`);
  //     }
  //   );
  // }

  // deleteGuia(id) {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger'
  //     },
  //     buttonsStyling: false
  //   })    
  //   swalWithBootstrapButtons.fire({
  //     title: 'Anular Registro',
  //     text: "??Desea anular este registro? No podr??s revertir esto!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Si',
  //     cancelButtonText: 'No',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.value) {
  //       this._registerService.deleteGuia(id).subscribe(
  //         (response: any) => {
  //           if(response) {
  //             this.getGuias(this.search);
  //           }
  //         }
  //       );
  //     } 
  //   });
  // }


  async actualizarFechaHora(i, nroFecha) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    var dataGuia;
    if (nroFecha === 1) {     
      if (!this.guias[i].FECHA_INICIO_VIAJE || !this.guias[i].HORA_INICIO_VIAJE || !this.guias[i].MIN_INICIO_VIAJE) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INICIO_VIAJE.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      
      let fechaInicio = this.guias[i].FECHA_INICIO_VIAJE + ' ' + this.guias[i].HORA_INICIO_VIAJE + ':' + this.guias[i].MIN_INICIO_VIAJE;
      let tiempoTardanza = await this._registerService.tiempoTardanzaControlViajes(fechaInicio,this.guias[i].ID_TRACTO);
      
      if(this.guias[i].ID_MOTIVO_OP == 0 && tiempoTardanza > 2) {
        Swal.fire('Mensaje', 'Debe indicar un motivo.', 'warning');
        return;
      }

      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_INICIO_VIAJE + ' ' + this.guias[i].HORA_INICIO_VIAJE + ':' + this.guias[i].MIN_INICIO_VIAJE,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };

      // console.log('dataGuia:', dataGuia);
      // return;
    }

    if (nroFecha === 2) {     
      if (!this.guias[i].FECHA_LLEGADA_PC  || !this.guias[i].HORA_LLEGADA_PC || !this.guias[i].MIN_LLEGADA_PC) {
        return;
      }    
      let hora = this.guias[i].HORA_LLEGADA_PC;
      let minutos = this.guias[i].MIN_LLEGADA_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_LLEGADA_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_LLEGADA_PC + ' ' + this.guias[i].HORA_LLEGADA_PC + ':' + this.guias[i].MIN_LLEGADA_PC,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 3) {
      if (!this.guias[i].FECHA_INGRESO_PC  || !this.guias[i].HORA_INGRESO_PC || !this.guias[i].MIN_INGRESO_PC) {
        return;
      }
      let hora = this.guias[i].HORA_INGRESO_PC;
      let minutos = this.guias[i].MIN_INGRESO_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INGRESO_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_INGRESO_PC + ' ' + this.guias[i].HORA_INGRESO_PC + ':' + this.guias[i].MIN_INGRESO_PC,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 4) {
      if (!this.guias[i].FECHA_SALIDA_PC || !this.guias[i].HORA_SALIDA_PC || !this.guias[i].MIN_SALIDA_PC) {
        return;
      }
      let hora = this.guias[i].HORA_SALIDA_PC;
      let minutos = this.guias[i].MIN_SALIDA_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_SALIDA_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_SALIDA_PC + ' ' + this.guias[i].HORA_SALIDA_PC + ':' + this.guias[i].MIN_SALIDA_PC,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 5) {
      if (!this.guias[i].FECHA_LLEGADA_PD || !this.guias[i].HORA_LLEGADA_PD || !this.guias[i].MIN_LLEGADA_PD) {
        return;
      }
      let hora = this.guias[i].HORA_LLEGADA_PD;
      let minutos = this.guias[i].MIN_LLEGADA_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_LLEGADA_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_LLEGADA_PD + ' ' + this.guias[i].HORA_LLEGADA_PD + ':' + this.guias[i].MIN_LLEGADA_PD,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 6) {     
      if (!this.guias[i].FECHA_INGRESO_PD || !this.guias[i].HORA_INGRESO_PD || !this.guias[i].MIN_INGRESO_PD) {
        return;
      }
      let hora = this.guias[i].HORA_INGRESO_PD;
      let minutos = this.guias[i].MIN_INGRESO_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INGRESO_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_INGRESO_PD + ' ' + this.guias[i].HORA_INGRESO_PD + ':' + this.guias[i].MIN_INGRESO_PD,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 7) {      
      if (!this.guias[i].FECHA_SALIDA_PD || !this.guias[i].HORA_SALIDA_PD || !this.guias[i].MIN_SALIDA_PD) {
        return;
      }
      let hora = this.guias[i].HORA_SALIDA_PD;
      let minutos = this.guias[i].MIN_SALIDA_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_SALIDA_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }      
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_SALIDA_PD + ' ' + this.guias[i].HORA_SALIDA_PD + ':' + this.guias[i].MIN_SALIDA_PD,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    if (nroFecha === 10) {      
      if (!this.guias[i].FECHA_FIN_VIAJE || !this.guias[i].HORA_FIN_VIAJE || !this.guias[i].MIN_FIN_VIAJE) {
        return;
      }
      let hora = this.guias[i].HORA_FIN_VIAJE;
      let minutos = this.guias[i].MIN_FIN_VIAJE;
      let arrayFecha = this.guias[i].FECHA_FIN_VIAJE.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto.', 'warning');
        return;
      }
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto.', 'warning');
        return;
      }      
      dataGuia = {
        idGuia: this.guias[i].ID_GUIA,
        fecha: this.guias[i].FECHA_FIN_VIAJE + ' ' + this.guias[i].HORA_FIN_VIAJE + ':' + this.guias[i].MIN_FIN_VIAJE,
        idUser: this._userService.user.ID_USER,
        nroFecha,
        idMotivo: this.guias[i].ID_MOTIVO_OP
      };
    }

    this._registerService.updateFechaGuiaControl(dataGuia).subscribe(
      (response: any) => {
        // console.log(response);
      },
      (error: any) => {
      }
    );
  }

  filtroPagina () {
    this.guias = this.guiasTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

   // Cambiar pagina de lista de empresas
   changePage(valor: number, pagina) {
    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;
    this.pagina = this.pagina + pagina;

    if (this.desde >= this.totalRegistros) {
      this.desde = this.desde - 10;
      this.hasta = this.desde + 10;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 10) {
      this.hasta = 10;
    }

    if (this.pagina >= this.paginas) {
      this.pagina = this.paginas;
    }
    
    if (this.pagina <= 0) {
      this.pagina = 1;
    }
    // this.getGuias(this.search);
    this.filtroPagina();
  }

  // printer() {
  //   this._userService.loadReport();
  //   if (this.search.length === 0) {
  //     window.open('#/reports/listguias/' + '0/' + this.fhDesde + '/' + this.fhHasta + '/0', '0', '_blank');
  //   } else {
  //     window.open('#/reports/listguias/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta + '/0', '0' , '_blank');
  //   }
  // }

  // Limpiar busqueda
  clear() {
    this.search = '';
     this.getGuias(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getGuias(this.search);
    }
  }

  motivosModal(i, modal, event) {
    this.iGuias = i;
    if (this.guias[i].ID_MOTIVO_OP == 0) {   
      event.srcElement.blur (); 
      event.preventDefault ();   
      this._ngbModal.open(modal);
    }
  }

  motivosModalDbclick(i, modal, event) { 
    this.iGuias = i;
    this.idMotivoNoOp = this.guias[i].ID_MOTIVO_OP;
    event.srcElement.blur (); 
    event.preventDefault ();  
    this._ngbModal.open(modal);
  }

  actualizarMotivo(modal) {
    if(this.idMotivoNoOp == 0) {
      Swal.fire('Mensaje', 'Debe indicar un motivo.', 'warning');
      return;
    }
    this.guias[this.iGuias].ID_MOTIVO_OP = this.idMotivoNoOp;
    this.iGuias = -1;
    this.nroFecha = 0;
    this.idMotivoNoOp = 0;
    this._ngbModal.dismissAll(modal);
  }

  cerrarModalMotivos(modal) {
    this.iGuias = -1;
    this.nroFecha = 0;
    this.idMotivoNoOp = 0;
    this._ngbModal.dismissAll(modal);
  }

  async actualizarLinea(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let dataGuia;
    let fhInicioViaje = null;
    let fhLlegadaPc = null;
    let fhIngresoPc = null;
    let fhSalidaPc = null;
    let fhLlegadaPd = null;
    let fhIngresoPd = null;
    let fhSalidaPd = null;
    let fhFinViaje = null;
    let idMotivo = 0;

    if (this.guias[i].FECHA_INICIO_VIAJE && this.guias[i].HORA_INICIO_VIAJE && this.guias[i].MIN_INICIO_VIAJE) {
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INICIO_VIAJE.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de inicio de viaje.', 'warning');
        return;
      }
      
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de inicio de viaje.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de inicio de viaje.', 'warning');
        return;
      }
      
      fhInicioViaje = this.guias[i].FECHA_INICIO_VIAJE + ' ' + this.guias[i].HORA_INICIO_VIAJE + ':' + this.guias[i].MIN_INICIO_VIAJE;
      idMotivo = this.guias[i].ID_MOTIVO_OP;
      
      let tiempoTardanza = await this._registerService.tiempoTardanzaControlViajes(fhInicioViaje,this.guias[i].ID_TRACTO);
      if(idMotivo == 0 && tiempoTardanza > 2) {
        Swal.fire('Mensaje', 'Debe indicar un motivo.', 'warning');
        return;
      }

      // console.log('fhInicioViaje', fhInicioViaje);
      // return;
    }

    if (this.guias[i].FECHA_LLEGADA_PC && this.guias[i].HORA_LLEGADA_PC && this.guias[i].MIN_LLEGADA_PC) {
      let hora = this.guias[i].HORA_LLEGADA_PC;
      let minutos = this.guias[i].MIN_LLEGADA_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_LLEGADA_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de llegada a punto de carga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de llegada a punto de carga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de llegada a punto de carga.', 'warning');
        return;
      }
      fhLlegadaPc = this.guias[i].FECHA_LLEGADA_PC + ' ' + this.guias[i].HORA_LLEGADA_PC + ':' + this.guias[i].MIN_LLEGADA_PC;
    }

    if (this.guias[i].FECHA_INGRESO_PC && this.guias[i].HORA_INGRESO_PC && this.guias[i].MIN_INGRESO_PC) {
      let hora = this.guias[i].HORA_INGRESO_PC;
      let minutos = this.guias[i].MIN_INGRESO_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INGRESO_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de ingreso a punto de carga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de ingreso a punto de carga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de ingreso a punto de carga.', 'warning');
        return;
      }
      fhIngresoPc = this.guias[i].FECHA_INGRESO_PC + ' ' + this.guias[i].HORA_INGRESO_PC + ':' + this.guias[i].MIN_INGRESO_PC;
    }

    if (this.guias[i].FECHA_SALIDA_PC && this.guias[i].HORA_SALIDA_PC && this.guias[i].MIN_SALIDA_PC) {
      let hora = this.guias[i].HORA_SALIDA_PC;
      let minutos = this.guias[i].MIN_SALIDA_PC;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_SALIDA_PC.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de salida de punto de carga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de salida de punto de carga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de salida de punto de carga.', 'warning');
        return;
      }
      fhSalidaPc = this.guias[i].FECHA_SALIDA_PC + ' ' + this.guias[i].HORA_SALIDA_PC + ':' + this.guias[i].MIN_SALIDA_PC;
    }

    if (this.guias[i].FECHA_LLEGADA_PD && this.guias[i].HORA_LLEGADA_PD && this.guias[i].MIN_LLEGADA_PD) {
      let hora = this.guias[i].HORA_LLEGADA_PD;
      let minutos = this.guias[i].MIN_LLEGADA_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_LLEGADA_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de llegada a punto de descarga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de llegada a punto de descarga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de llegada a punto de descarga.', 'warning');
        return;
      }
      fhLlegadaPd = this.guias[i].FECHA_LLEGADA_PD + ' ' + this.guias[i].HORA_LLEGADA_PD + ':' + this.guias[i].MIN_LLEGADA_PD;
    }

    if (this.guias[i].FECHA_INGRESO_PD && this.guias[i].HORA_INGRESO_PD && this.guias[i].MIN_INGRESO_PD) {
      let hora = this.guias[i].HORA_INGRESO_PD;
      let minutos = this.guias[i].MIN_INGRESO_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_INGRESO_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de ingreso a punto de descarga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de ingreso a punto de descarga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de ingreso a punto de descarga.', 'warning');
        return;
      }
      fhIngresoPd = this.guias[i].FECHA_INGRESO_PD + ' ' + this.guias[i].HORA_INGRESO_PD + ':' + this.guias[i].MIN_INGRESO_PD;
    }

    if (this.guias[i].FECHA_SALIDA_PD && this.guias[i].HORA_SALIDA_PD && this.guias[i].MIN_SALIDA_PD) {
      let hora = this.guias[i].HORA_SALIDA_PD;
      let minutos = this.guias[i].MIN_SALIDA_PD;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_SALIDA_PD.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de salida de punto de descarga.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de salida de punto de descarga.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de salida de punto de descarga.', 'warning');
        return;
      }
      fhSalidaPd = this.guias[i].FECHA_SALIDA_PD + ' ' + this.guias[i].HORA_SALIDA_PD + ':' + this.guias[i].MIN_SALIDA_PD;
    }

    if (this.guias[i].FECHA_FIN_VIAJE && this.guias[i].HORA_FIN_VIAJE && this.guias[i].MIN_FIN_VIAJE) {
      let hora = this.guias[i].HORA_FIN_VIAJE;
      let minutos = this.guias[i].MIN_FIN_VIAJE;
      hora = parseInt(hora);
      minutos = parseInt(minutos);
      let arrayFecha = this.guias[i].FECHA_FIN_VIAJE.split('-');
      let anio = arrayFecha[0];
      if (anio.length > 4) {
        Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de fin de viaje.', 'warning');
        return;
      }
      if (hora < 0 || hora > 23) {
        Swal.fire('Mensaje', 'Formato de hora incorrecto en fecha de fin de viaje.', 'warning');
        return;
      }
      if (minutos < 0 || minutos > 59) {
        Swal.fire('Mensaje', 'Formato de minutos incorrecto en fecha de fin de viaje.', 'warning');
        return;
      }
      fhFinViaje = this.guias[i].FECHA_FIN_VIAJE + ' ' + this.guias[i].HORA_FIN_VIAJE + ':' + this.guias[i].MIN_FIN_VIAJE;
    }

    dataGuia = {
      idGuia: this.guias[i].ID_GUIA,
      fhInicioViaje,
      fhLlegadaPc,
      fhIngresoPc,
      fhSalidaPc,
      fhLlegadaPd,
      fhIngresoPd,
      fhSalidaPd,
      fhFinViaje,
      idUser: this._userService.user.ID_USER,
      idMotivo
    };
   
    this._registerService.updateLineaFechaGuiaControl(dataGuia).subscribe(
      (response: any) => {
        // console.log(response);
      }
    );
  }

  async actualizarFechas() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let dataGuia = [];
    let fhInicioViaje = '';
    let fhLlegadaPc = '';
    let fhIngresoPc = '';
    let fhSalidaPc = '';
    let fhLlegadaPd = '';
    let fhIngresoPd = '';
    let fhSalidaPd = '';
    let fhFinViaje = '';
    let idMotivo = 0;
    let idUser = this._userService.user.ID_USER

    this.guiasTotal.forEach(function (guias) { 
      if (guias.FECHA_INICIO_VIAJE && guias.HORA_INICIO_VIAJE && guias.MIN_INICIO_VIAJE) {
        let hora = guias.HORA_INICIO_VIAJE;
        let minutos = guias.MIN_INICIO_VIAJE;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_INICIO_VIAJE.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de inicio de viaje.', 'warning');
          return;
        }
        
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhInicioViaje = guias.FECHA_INICIO_VIAJE + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_LLEGADA_PC && guias.HORA_LLEGADA_PC && guias.MIN_LLEGADA_PC) {
        let hora = guias.HORA_LLEGADA_PC;
        let minutos = guias.MIN_LLEGADA_PC;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_LLEGADA_PC.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de llegada en punto de carga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhLlegadaPc = guias.FECHA_LLEGADA_PC + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_INGRESO_PC && guias.HORA_INGRESO_PC && guias.MIN_INGRESO_PC) {
        let hora = guias.HORA_INGRESO_PC;
        let minutos = guias.MIN_INGRESO_PC;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_INGRESO_PC.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de ingreso a punto de carga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhIngresoPc = guias.FECHA_INGRESO_PC + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_SALIDA_PC && guias.HORA_SALIDA_PC && guias.MIN_SALIDA_PC) {
        let hora = guias.HORA_SALIDA_PC;
        let minutos = guias.MIN_SALIDA_PC;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_SALIDA_PC.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de salida de punto de carga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhSalidaPc = guias.FECHA_SALIDA_PC + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_LLEGADA_PD && guias.HORA_LLEGADA_PD && guias.MIN_LLEGADA_PD) {
        let hora = guias.HORA_LLEGADA_PD;
        let minutos = guias.MIN_LLEGADA_PD;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_LLEGADA_PD.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de llegada a punto de descarga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhLlegadaPd = guias.FECHA_LLEGADA_PD + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_INGRESO_PD && guias.HORA_INGRESO_PD && guias.MIN_INGRESO_PD) {
        let hora = guias.HORA_INGRESO_PD;
        let minutos = guias.MIN_INGRESO_PD;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_INGRESO_PD.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de ingreso a punto de descarga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhIngresoPd = guias.FECHA_INGRESO_PD + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_SALIDA_PD && guias.HORA_SALIDA_PD && guias.MIN_SALIDA_PD) {
        let hora = guias.HORA_SALIDA_PD;
        let minutos = guias.MIN_SALIDA_PD;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_SALIDA_PD.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de salida de punto de descarga.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhSalidaPd = guias.FECHA_SALIDA_PD + ' ' + hora + ':' + minutos;
      }

      if (guias.FECHA_FIN_VIAJE && guias.HORA_FIN_VIAJE && guias.MIN_FIN_VIAJE) {
        let hora = guias.HORA_FIN_VIAJE;
        let minutos = guias.MIN_FIN_VIAJE;
        hora = parseInt(hora);
        minutos = parseInt(minutos);
        let arrayFecha = this.guias.FECHA_FIN_VIAJE.split('-');
        let anio = arrayFecha[0];
        if (anio.length > 4) {
          Swal.fire('Mensaje', 'Formato de a??o incorrecto en fecha de fin de viaje.', 'warning');
          return;
        }
        if (hora < 0) {
         hora = '00';
        }
        if (hora > 23) {
          hora = '23';
        }
        if (minutos < 0) {
         minutos = '00'
        }
        if (minutos > 59) {
          minutos = '59';
        }
        fhFinViaje = guias.FECHA_FIN_VIAJE + ' ' + hora + ':' + minutos;
      }
      idMotivo = guias.ID_MOTIVO_OP;
      dataGuia.push({
        idGuia: guias.ID_GUIA,
        fhInicioViaje,
        fhLlegadaPc,
        fhIngresoPc,
        fhSalidaPc,
        fhLlegadaPd,
        fhIngresoPd,
        fhSalidaPd,
        fhFinViaje,
        idUser,
        idMotivo
      })
  
    });
    this._registerService.updateFechasGuiaControl(dataGuia).subscribe(
      (response: any) => {
        // console.log(response);
      }
    );
  }

  // nextFocus() {
  //   var directive = {
  //     restrict: 'A',
  //     link: function(scope, elem, attrs) {
  //       elem.bind('keydown', function(e) {
  //         var partsId = attrs.id.match(/field(\d{1})/);
  //         var currentId = parseInt(partsId[1]);

  //         var code = e.keyCode || e.which;
  //         if (code === 13) {
  //           e.preventDefault();
  //           document.querySelector('#field' + (currentId + 1)).focus();
  //         }
  //       });
  //     }
  //   };
  //   return directive;

  // }

}
