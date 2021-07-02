import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-repositorio-docs',
  templateUrl: './repositorio-docs.component.html',
  styles: [
  ]
})
export class RepositorioDocsComponent implements OnInit {
  pdfSrc = '';
  URL = environment.URL_SERVICES;
  clasificacionDoc = [];
  categoriasDoc = [];
  areasBriane = [];
  documentos = [];
  loading = false;
  idClasificacionDoc = '';
  idCategoriaDoc = '';
  idArea = '';
  idDocumento = '';
  totalDocumentos = 0;
  loadingDoc = false;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url); 
    this.getClasificacionDocBriane();
    this.getAreasBriane();
  }

  getClasificacionDocBriane() {
    this.loading = true;
    this.spinner.show();
    this._registerService.getClasificacionDocBriane().subscribe(
      (response: any) => {
        this.pdfSrc = '';
        this.idCategoriaDoc = '';
        this.idArea = '';
        this.idDocumento = '';
        this.clasificacionDoc = response.clasificacionDocumentos;
        this.loading = false;
        this.spinner.hide();
      },
      (error:any) => {
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  getAreasBriane() {
    this.loading = true;
    this.spinner.show();
    this._registerService.getAreasBriane().subscribe(
      (response: any) => {
        this.idDocumento = '';
        this.pdfSrc = '';
        this.areasBriane = response.areasBriane;
        this.loading = false;
        this.spinner.hide();
      },
      (error: any) => {
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  async getCategoriaDocBriane() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idClasificacionDoc === '') {
      this.idCategoriaDoc = '';
      this.idArea = '';
      this.idDocumento = '';
      this.pdfSrc = '';
      this.categoriasDoc = [];
      this.documentos = [];
      this.totalDocumentos = 0;
      return;
    }
    this.loading = true
    this.spinner.show();
    
    this._registerService.getCategoriaDocBriane(this.idClasificacionDoc).subscribe(
      (response: any) => {
        this.idArea = '';
        this.idDocumento = '';
        this.pdfSrc = '';
        this.categoriasDoc = response.categoriaDocumenos;
        this.getDocumentosBriane();
        this.loading = false;
        this.spinner.hide();
      },
      (error: any) => {
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  async getDocumentosBriane() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idCategoriaDoc === '' || this.idArea === '') {
      this.idDocumento = '';
      this.pdfSrc = '';
      this.documentos = [];
      this.totalDocumentos = 0;
      return;
    }
    this.loading = true;
    this.spinner.show();
    this._registerService.getDocumentosBriane(this.idClasificacionDoc, this.idCategoriaDoc, this.idArea).subscribe(
      (response: any) => {
        this.idDocumento = '';
        this.pdfSrc = '';
        this.documentos = response.documentosBriane;
        this.totalDocumentos = this.documentos.length;
        this.loading = false;
        this.spinner.hide();
      },
      (error: any) => {
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  async verPdf(idDocumento) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.loadingDoc = true;
    const documento = this.documentos.find( documento => documento.ID_DOCUMENTO == idDocumento );
    if (documento) {
      let nombreDoc = documento.NOMBRE_ARCHIVO;
      this.pdfSrc = this.URL +'/image/documentos-briane/' + nombreDoc ;  
      this.loadingDoc = false;
    } else {
      this.pdfSrc = '';  
      this.loadingDoc = false;
    }
  }

}
