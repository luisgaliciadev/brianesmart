import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportspro-op',
  templateUrl: './reportspro-op.component.html',
  styles: [
  ]
})
export class ReportsproOpComponent implements OnInit {
  reportsProOp = [];
  desde = 0;
  hasta = 5;
  loading = true;
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
  reportTotal = [];
  reportes = []

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
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
    this.getReportsOp();
  }

  getReportsOp() {
    this.loading = true;
    this._registerService.getReportsPro(this.fhDesde, this.fhHasta, this.search).subscribe(
      (response: any) => {
        // console.log(response);
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.reportspro.length;
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.reportTotal = response.reportspro;
        this.reportsProOp = this.reportTotal.slice(this.desde, this.hasta);
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

  aprobarReporte(id, idZona) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Aprobar Reporte',
      text: "¿Desea aprobar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._registerService.aprobarReportePro(id, idZona).subscribe(
          (response:any) => {
            if(response) {
              this.getReportsOp();
            }
          },
            error => {
              if(error) {
                this.loading = false;
              }
            }
        );
      } 
    });
  }

  deleteReportOp(id) {
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
        this._registerService.deleteReportOP(id).subscribe(
          (response: any) => {
            if(response) {
              this.getReportsOp();
            }
          },
          error => {
            if(error) {
              this.loading = false;
            }
          }
        );
      } 
    });
  }

  filtroPagina () {
    this.reportsProOp = this.reportTotal.slice(this.desde, this.hasta);
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

  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listoreportpro/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/listoreportpro/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getReportsOp();
    this.pagina = 1;
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getReportsOp();
    }
  }

}
