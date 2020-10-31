import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-panelcontrol-viajes',
  templateUrl: './panelcontrol-viajes.component.html',
  styles: [
  ]
})
export class PanelcontrolViajesComponent implements OnInit {
  guias = [];
  desde = 0;
  hasta = 8;
  loading = false;
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


  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
  ) {
    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    if (this.mes < 8) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 8) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.fhDesde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
   }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getZonasConcutor();
    // this.getGuias(this.search);    
  }

  getZonasConcutor() {
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
      }
    );
  }

  getGuias(search) {
    if (this.idZona == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una zona.', 'warning');
      return;
    }
    if (search === '') {
      search = '0';
    }
    this.loading = true;
    this._registerService.getGuiasControlViaje(search, this.fhDesde, this.fhHasta, 0, this.idZona).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 8;
        this.pagina = 1;
        this.totalRegistros = response.guias.length;
        this.guiasTotal = response.guias;
        this.guias = this.guiasTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 8);
        console.log(this.paginas);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.loading = false;
        this.activeButton = false;
      },
      (error: any) => {
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

   // Exportar a excel listado de usuarios
   getGuiasExcel() {
    this._registerService.getGuiasExcel(this.search, this.fhDesde, this.fhHasta, 0).subscribe(
      (response: any) => {
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoGuias.xlsx`);
      }
    );
  }

  deleteGuia(id) {
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
        this._registerService.deleteGuia(id).subscribe(
          (response: any) => {
            // console.log(response);
            if(response) {
              this.getGuias(this.search);
            }
          }
        );
      } 
    });
  }

  actualizarFechaHora(i, nroFecha) {
    var dataGuia;

    if (nroFecha == 1) {     
      if (!this.guias[i].FECHA_INICIO_VIAJE || !this.guias[i].HORA_INICIO_VIAJE || !this.guias[i].MIN_INICIO_VIAJE) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
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
        fecha: this.guias[i].FECHA_INICIO_VIAJE + ' ' + this.guias[i].HORA_INICIO_VIAJE + ':' + this.guias[i].MIN_INICIO_VIAJE,
        idUser: this._userService.user.ID_USER,
        nroFecha
      };
    }

    if (nroFecha == 2) {
      if (!this.guias[i].FECHA_INGRESO_PC  || !this.guias[i].HORA_INGRESO_PC || !this.guias[i].MIN_INGRESO_PC) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
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
        fecha: this.guias[i].FECHA_INGRESO_PC + ' ' + this.guias[i].HORA_INGRESO_PC + ':' + this.guias[i].MIN_INGRESO_PC,
        idUser: this._userService.user.ID_USER,
        nroFecha
      };
    }

    if (nroFecha == 3) {
      if (!this.guias[i].FECHA_SALIDA_PC || !this.guias[i].HORA_SALIDA_PC || !this.guias[i].MIN_SALIDA_PC) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
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
        fecha: this.guias[i].FECHA_SALIDA_PC + ' ' + this.guias[i].HORA_SALIDA_PC + ':' + this.guias[i].MIN_SALIDA_PC,
        idUser: this._userService.user.ID_USER,
        nroFecha
      };
    }

    if (nroFecha == 4) {     
      if (!this.guias[i].FECHA_INGRESO_PD || !this.guias[i].HORA_INGRESO_PD || !this.guias[i].MIN_INGRESO_PD) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
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
        fecha: this.guias[i].FECHA_INGRESO_PD + ' ' + this.guias[i].HORA_INGRESO_PD + ':' + this.guias[i].MIN_INGRESO_PD,
        idUser: this._userService.user.ID_USER,
        nroFecha
      };
    }

    if (nroFecha == 5) {      
      if (!this.guias[i].FECHA_SALIDA_PD || !this.guias[i].HORA_SALIDA_PD || !this.guias[i].MIN_SALIDA_PD) {
        return;
      }
      let hora = this.guias[i].HORA_INICIO_VIAJE;
      let minutos = this.guias[i].MIN_INICIO_VIAJE;
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
        fecha: this.guias[i].FECHA_SALIDA_PD + ' ' + this.guias[i].HORA_SALIDA_PD + ':' + this.guias[i].MIN_SALIDA_PD,
        idUser: this._userService.user.ID_USER,
        nroFecha
      };
    }

    if (nroFecha == 6) {      
      if (!this.guias[i].FECHA_FIN_VIAJE || !this.guias[i].HORA_FIN_VIAJE || !this.guias[i].MIN_FIN_VIAJE) {
        return;
      }
      let hora = this.guias[i].HORA_FIN_VIAJE;
      let minutos = this.guias[i].MIN_FIN_VIAJE;
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
        nroFecha
      };
    }

    this._registerService.updateFechaGuiaControl(dataGuia).subscribe(
      (response: any) => {
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
      this.desde = this.desde - 8;
      this.hasta = this.desde + 8;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 8) {
      this.hasta = 8;
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


  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listguias/' + '0/' + this.fhDesde + '/' + this.fhHasta + '/0', '0', '_blank');
    } else {
      window.open('#/listguias/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta + '/0', '0' , '_blank');
    }
  }

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

}
