import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService, RegisterService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styles: [
  ]
})
export class ViaticosComponent implements OnInit {
  viaticos = [];
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
  dataGrafico;
  paginas = 0;
  pagina = 1;
  viaticosTotal = [];

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
    // this.getViaticos();
  }

  async getViaticos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    this._registerService.getViaticos(this.fhDesde, this.fhHasta, this.search).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.viaticos.length;
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.viaticosTotal = response.viaticos;
        this.viaticos = this.viaticosTotal.slice(this.desde, this.hasta);
        this.spinner.hide();
        this.activeButton = false;
      }
    );
  }

  async deleteViaticos(id) {
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
        this._registerService.deleteViaticos(id).subscribe(
          (response: any) => {
            if(response) {
              this.getViaticos();
            }
          }
        );
      } 
    });
  }

  async aprobarViaticos(id) {
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
      title: 'Aprobar Vi??ticos',
      text: "??Desea aprobar este registro? No podr??s revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._registerService.aprobarViaticos(id).subscribe(
          (response: any) => {
            if(response) {
              this.getViaticos();
            }
          }
        );
      } 
    });
  }

  async generarComprobantes(id) {
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
      title: 'Generar Comprobantes',
      text: "??Desea generar los comprobantes? No podr??s revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._registerService.generarComprobantes(id).subscribe(
          (response: any) => {
            if(response) {
              this.getViaticos();
            }
          }, 
          error => {
            this.spinner.hide();
          }
        );
      } 
    });
  }

  filtroPagina () {
    this.viaticos = this.viaticosTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

  // Cambiar pagina de lista de empresas
  changePage(valor: number, pagina: number) {
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
      window.open('#/reports/listviaticos/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/reports/listviaticos/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  async verResumen(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.loadReport();    
    window.open('#/reports/listresumenviaticos/' + id, '0', '_blank');
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getViaticos();
    this.pagina = 1;
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getViaticos();
    }
  }
}
