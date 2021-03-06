import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styles: [
  ]
})
export class DenunciasComponent implements OnInit {
  denuncias = [];
  desde: number;
  hasta: number;
  totalRegistros = 0;
  search: string;
  activeButton;

  constructor(
    public _userService: UserService,
    public _registerService: RegisterService,
    public _router: Router,
    private spinner: NgxSpinnerService
  ) { 
    this.desde = 0;
    this.hasta = 5;
    this.search = '';
    this.activeButton = false;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

  // Listar denuncias
  async getDenuncias(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.activeButton = false;
    this.search = search;

    this.spinner.show();
    this._registerService.getDenuncias(this.search).subscribe(
      (response: any) => {  
        this.denuncias = response.denuncias.slice(this.desde, this.hasta);
        this.totalRegistros = response.denuncias.length;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  // Borrar denuncia
  async deleteDenuncia(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._registerService.deleteDenuncia(id).subscribe(
      (response: any) => {
        this.getDenuncias(this.search );
      }
    );
  }

  // Exportar a excel listado de empresas
  async getDenunciasExcel() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.spinner.show();
    this._registerService.getDenunciasExcel(this.search).subscribe(
      (response: any) => {
        let fileBlob = response;       
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoDenuncias.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
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

    this.getDenuncias(this.search);
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
      window.open('#/reports/listdenuncias/' + '0', '0' , '_blank');
    } else {
      window.open('#/reports/listdenuncias/' + this.search, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getDenuncias(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getDenuncias(this.search);
    }
  }


}
