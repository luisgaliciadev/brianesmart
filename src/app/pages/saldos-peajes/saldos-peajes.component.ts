import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-saldos-peajes',
  templateUrl: './saldos-peajes.component.html',
  styles: [
  ]
})
export class SaldosPeajesComponent implements OnInit {
  peajes = [];
  desde = 0;
  hasta = 5;
  loading = false;
  totalRegistros = 0;
  search = '';
  activeButton;
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  paginas = 0;
  pagina = 1;
  peajesTotal = [];

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
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
  }

  async getPeajeSaldos(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    if (search === '') {
      search = '0';
    }
    this._registerService.getPeajeSaldos(search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.peajeSaldos.length;
        this.peajesTotal = response.peajeSaldos;
        this.peajes = this.peajesTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.spinner.hide();
        this.activeButton = false;
      }
    );
  }

  async getExcelSaldos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.spinner.show();
    this._registerService.getExcelSaldosPeaje(this.fhDesde, this.fhHasta, this.search).subscribe(
      (response: any) => {
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `saldosPeaje.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  filtroPagina () {
    this.peajes = this.peajesTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

   // Cambiar pagina de lista de empresas
   changePage(valor: number, pagina) {
    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;
    this.pagina = this.pagina + pagina;

    if (this.desde >= this.totalRegistros) {
      this.desde = this.desde - 5;
      this.hasta = this.desde + 5;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 5) {
      this.hasta = 5;
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

  async printer() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/reports/listsaldospeaje/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/reports/listsaldospeaje/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
     this.getPeajeSaldos(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getPeajeSaldos(this.search);
    }
  }

  seleccionarTodo() {
    // console.log(this.peajesTotal);
    var i;
    for (i = 0; i < this.peajesTotal.length; i++) {
      if (this.peajesTotal[i].FG_NOTIFICADO_AUX === 0) {
        this.peajesTotal[i].FG_NOTIFICADO = 1;
      }
    }
    // console.log(this.peajesTotal);
  }

  quitarSeleccion() {
    var i;
    for (i = 0; i < this.peajesTotal.length; i++) {
      if (this.peajesTotal[i].FG_NOTIFICADO_AUX === 0) {
        this.peajesTotal[i].FG_NOTIFICADO = 0;
      }
    }
  }

  async notificarSaldos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }    
    var saldos = [];
    this.peajesTotal.forEach(function (saldo) {
      if (saldo.FG_NOTIFICADO && saldo.FG_NOTIFICADO_AUX === 0) {
        saldos.push({
          nroSolicitudPeaje: saldo.ID_PEAJE,
          fechaSolicitudPeaje: saldo.FH_SOLICITUD,
          nroOrdenServicio: saldo.CORRELATIVO,
          cliente: saldo.RAZON_SOCIAL,
          ruta: saldo.ORIGEN + '-' + saldo.DESTINO,
          idDetaPeaje: saldo.ID_DETA_PEAJE,
          dni: saldo.IDENTIFICACION,
          conductor: saldo.NOMBRE_APELLIDO,
          fechaPeaje: saldo.FH_PEAJE,
          montoPeaje: saldo.MONTO,
          abono: saldo.ABONO,
          saldo: saldo.TOTAL_SUSTENTAR       
        });
      }
    });
    if (saldos.length === 0) {
      Swal.fire('Mensaje', 'Debe seleccionar al menos un registro para enviar la notificación', 'warning');
      return;
    }
    this.spinner.show();

    this._registerService.notificarSaldos(saldos).subscribe(
      (response: any) => {
        // console.log(response);
        this.getPeajeSaldos(this.search);
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
    // console.log('saldos:',saldos);
  }

}
