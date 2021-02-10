import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productividad-conductor',
  templateUrl: './productividad-conductor.component.html',
  styles: [
  ]
})
export class ProductividadConductorComponent implements OnInit {
  productividadConductores = [];
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
  productividadTotal = [];
  dias = [];
  cantDias = 0;
  pruebaHtml;

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

    this.pruebaHtml = `
    <div class="form-group">
        <div class="input-group">
            <input [(ngModel)]="search" type="text" class="form-control" placeholder="Buscar" >                        
            <div class="input-group-addon"><i class="mdi mdi-delete-forever pointer" data-toggle="tooltip" data-placement="top" title="Borrar Busqueda"></i></div>
        </div>
    </div>
    `
  }

  ngOnInit(): void {
  }

  getProductividad() {
    this.loading = true;
    this._registerService.getProductividadConductor(this.fhDesde, this.fhHasta).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.productividaConductor.length;
        this.dias = response.dias;
        this.cantDias = this.dias.length;
        console.log('dias', this.dias)
        this.productividadTotal = response.productividaConductor;
        this.productividadConductores = this.productividadTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.loading = false;
      }
    );

  }

  filtroPagina () {
    // this.peajes = this.peajesTotal.slice(this.desde, this.hasta);
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


}
