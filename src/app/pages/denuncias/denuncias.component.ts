import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styles: [
  ]
})
export class DenunciasComponent implements OnInit {

  public denuncias = [];
  public desde: number;
  public hasta: number;
  public loading = true;
  public totalRegistros = 0;
  
  public search: string;
  public activeButton;

  constructor(
    public _userService: UserService,
    public _registerService: RegisterService,
    public _router: Router
  ) { 
    this.desde = 0;
    this.hasta = 5;
    this.search = '';
    this.activeButton = false;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getDenuncias(this.search);
  }

  // Listar denuncias
  getDenuncias(search) {
    this.activeButton = false;
    this.search = search;

    this.loading = true;
    this._registerService.getDenuncias(this.search).subscribe(
      (response: any) => { 
        // console.log(response.denuncias);      
        this.denuncias = response.denuncias.slice(this.desde, this.hasta);
        this.totalRegistros = response.denuncias.length;
        this.loading = false;
        // console.log(this.denuncias);
        // console.log(this.totalRegistros);
      }
    );
  }

  // Borrar denuncia
  deleteDenuncia(id) {
    this._registerService.deleteDenuncia(id).subscribe(
      (response: any) => {
        // console.log(response);
        this.getDenuncias(this.search );
      }
    );
  }

  // Exportar a excel listado de empresas
  getDenunciasExcel() {
    this._registerService.getDenunciasExcel(this.search).subscribe(
      (response: any) => {
       
        let fileBlob = response;
       
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoDenuncias.xlsx`);
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

  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listdenuncias/' + '0', '0' , '_blank');
    } else {
      window.open('#/listdenuncias/' + this.search, '0' , '_blank');
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
