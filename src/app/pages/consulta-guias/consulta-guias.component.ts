import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-guias',
  templateUrl: './consulta-guias.component.html',
  styles: [
  ]
})
export class ConsultaGuiasComponent implements OnInit {

  guias = [];
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
  paginas = 0;
  pagina = 1;
  guiasTotal = [];

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
  ) { 
    // this.loading = false;
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
    this.getGuias(this.search);
  }

  getGuias(search) {
    this.loading = true;
    if (search === '') {
      search = '0';
    }
    this._registerService.getGuias(search, this.fhDesde, this.fhHasta, 0).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.guias.length;
        this.guiasTotal = response.guias;
        this.guias = this.guiasTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

   // Exportar a excel listado de usuarios
   getGuiasExcel() {
    this._registerService.getGuiasExcel(this.search, this.fhDesde, this.fhHasta, 0).subscribe(
      (response: any) => {
        // tslint:disable-next-line: prefer-const
        let fileBlob = response;
        // tslint:disable-next-line: prefer-const
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
