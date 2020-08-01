import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';

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
  viaticosTotal = [];
  

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
    
    this.getViaticos();
  }

  getViaticos() {
    this.loading = true;
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
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

  deleteViaticos(nroSemana, zona) {
    this._registerService.deleteViaticos(nroSemana,zona).subscribe(
      (response: any) => {
        if(response) {
          this.getViaticos();
        }
      }
    );
  }

  filtroPagina () {
    console.log(this.viaticos);
    this.viaticos = this.viaticosTotal.slice(this.desde, this.hasta);
    console.log(this.viaticos);
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
      window.open('#/listviaticos/' + '0/' + this.fhDesde + '/' + this.fhHasta, '0', '_blank');
    } else {
      window.open('#/listviaticos/' + this.search + '/' + this.fhDesde + '/' + this.fhHasta, '0' , '_blank');
    }
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
