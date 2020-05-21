import { Component, OnInit } from '@angular/core';
import { CompanyUser } from 'src/app/models/companyUser.model';
import { UserService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver';



@Component({
  selector: 'app-companys',
  templateUrl: './companys.component.html',
  styles: []
})
export class CompanysComponent implements OnInit {

  public companyUser: CompanyUser[] = [];
  public desde: number;
  public hasta: number;
  public loading = true;
  public totalRegistros = 0;
  public ID_USER: number;
  public search: string;
  public activeButton;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService,
    // tslint:disable-next-line: variable-name
    public _router: Router
  ) {
      this.ID_USER = this._userService.user.ID_USER;
      this.desde = 0;
      this.hasta = 5;
      this.search = '';
      this.activeButton = false;
  }

  ngOnInit() {
    this.getCompanys(this.search);
    this._modalUploadService.notificacion.subscribe(
      response => {
        this.getCompanys(this.search);
      },
    );
  }

  // Listar empresas
  getCompanys(search) {
    this.activeButton = false;
    this.search = search;

    this.loading = true;
    this._userService.getCompanys(this.ID_USER, this.search).subscribe(
      (response: any) => {
        // console.log(response.companys);
        // console.log(response.companys.slice(this.desde, this.hasta));

        this.companyUser = response.companys.slice(this.desde, this.hasta);
        this.totalRegistros = response.companys.length;
        this.loading = false;
      }
    );
  }

  // Borrar empresa
  deleteCompany(id) {
    // console.log(id);
    this._userService.deleteCompany(id).subscribe(
      (response: any) => {
        // console.log(response);
        this.getCompanys(this.search );
      }
    );
  }

  // Exportar a excel listado de empresas
  getCompanysExcel() {
    this._userService.getCompanysExcel(this.search).subscribe(
      (response: any) => {
        // tslint:disable-next-line: prefer-const
        let fileBlob = response;
        // tslint:disable-next-line: prefer-const
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoEmpresas.xlsx`);
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

    this.getCompanys(this.search);
  }

  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listcompanys/' + '0', '0' , '_blank');
    } else {
      window.open('#/listcompanys/' + this.search, '0' , '_blank');
    }
  }

  // Mostrar Modal
  showModal(type: string, id: number, image: string, google: boolean) {
    // console.log(google);
    this._modalUploadService.showModal(type, id, image, google);
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getCompanys(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getCompanys(this.search);
    }
  }


}
