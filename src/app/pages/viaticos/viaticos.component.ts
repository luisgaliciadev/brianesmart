import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styles: [
  ]
})
export class ViaticosComponent implements OnInit {
  viaticos = [];
  desde: number;
  hasta: number;
  loading = true;
  totalRegistros = 0;
  search: string;
  activeButton;

  constructor(
    public _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.loading = false;
  }

  // Cambiar pagina de lista de empresas
  changePage(valor: number) {

    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;

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

    // this.getCompanys(this.search);
  }


  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listclients/' + '0', '0', '_blank');
    } else {
      window.open('#/listclients/' + this.search, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    // this.getClients(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      // this.getClients(this.search);
    }
  }
}
