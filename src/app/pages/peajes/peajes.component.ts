import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-peajes',
  templateUrl: './peajes.component.html',
  styles: [
  ]
})
export class PeajesComponent implements OnInit {

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
    // this.spinner.hide();
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
    // this.getPeajes(this.search);
  }

  async getPeajes(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    if (search === '') {
      search = '0';
    }
    this._registerService.getPeajes(search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.peajes.length;
        this.peajesTotal = response.peajes;
        this.peajes = this.peajesTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.spinner.hide();
        this.activeButton = false;
      },
      error => {
        this.spinner.hide();
        this.activeButton = false;
      }
    );
  }

  // Exportar a excel listado de usuarios
  async getExcelDetaPeajes() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.spinner.show();
    this._registerService.getExcelDetaPeajes(this.search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {        
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `detalleSolicitudGatosOperativos.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async deletePeaje(id) {
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
      text: "??Desea anular este registro? No podr??s revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._registerService.deletePeaje(id).subscribe(
          (response: any) => {
            this.getPeajes(this.search);
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
      } 
    });
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
      window.open('#/reports/listpeajes/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/reports/listpeajes/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
     this.getPeajes(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getPeajes(this.search);
    }
  }

}
