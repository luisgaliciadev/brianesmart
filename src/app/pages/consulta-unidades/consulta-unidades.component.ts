import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-unidades',
  templateUrl: './consulta-unidades.component.html',
  styles: [
  ]
})
export class ConsultaUnidadesComponent implements OnInit {

  unidades = [];
  desde = 0;
  hasta = 5;
  totalRegistros = 0;
  search = '';
  activeButton;
  paginas = 0;
  pagina = 1;
  unidadesTotal = [];

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

  async getUnidades() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    this._registerService.getUnidades(this.search).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.unidades.length;
        this.unidadesTotal = response.unidades;
        this.unidades = this.unidadesTotal.slice(this.desde, this.hasta);
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

    // this.getRutas(this.search);
    this.filtroPagina();
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
     this.getUnidades();
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getUnidades();
    }
  }

  filtroPagina () {
    this.unidades = this.unidadesTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }


}
