import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareos-operaciones',
  templateUrl: './tareos-operaciones.component.html',
  styles: [
  ]
})
export class TareosOperacionesComponent implements OnInit {

  tareosOp = [];
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
  tareosOpTotal = [];

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
  }

  async getTareosOp(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (search === '') {
      search = '0';
    }
    this.loading = true;
    this._registerService.getTareosOp(search, this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        console.log(response);
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.tareosOperaciones.length;
        this.tareosOpTotal = response.tareosOperaciones;
        this.tareosOp = this.tareosOpTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.loading = false;
        this.activeButton = false;
      },
      error => {
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

  filtroPagina () {
    this.tareosOp = this.tareosOpTotal.slice(this.desde, this.hasta);
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
      window.open('#/listpeajes/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/listpeajes/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
     this.getTareosOp(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getTareosOp(this.search);
    }
  }

}
