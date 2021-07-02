import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-documentos-unidad',
  templateUrl: './documentos-unidad.component.html',
  styles: [
  ]
})
export class DocumentosUnidadComponent implements OnInit {
  documentos = [];
  nombreDocumento = '';
  totalRegistros = 0;
  loading = false;
  search = '';
  tipoDocumentos = [];
  diasTramite = [];
  idTipoDocumento = 1;
  cantDias = 1;
  fgFhVencimiento = 1;

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getTipoDocumentosUnidad();
    this.getDiasTramiteUnidadCond();
    this.getDocumentos();
  }

  getDiasTramiteUnidadCond() {
    this.spinner.show();
    this._registerService.getDiasTramiteUnidadCond().subscribe(
      (response: any) => {
        this.diasTramite = response.cantidadDiasTramite;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      }
    );
  }

  getTipoDocumentosUnidad() {
    this.spinner.show();
    this._registerService.getTipoDocumentosUnidad().subscribe(
      (response: any) => {
        this.tipoDocumentos = response.tipoDocumentosUnidad;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      }
    );
  }

  async getDocumentos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    if (this.search === '') {
      this.search = '0';
    }
    this._registerService.getDocUnidades(this.search).subscribe(
      (response: any) => {
        this.documentos = response.documentos;
        this.totalRegistros = this.documentos.length;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async guardarDocumento(data) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let documento = {
      nombreDocumento: data.nombreDocumento,
      idTipoDocumento: data.idTipoDocumento,
      idCantDias: data.cantDias,
      fgFhVencimiento: data.fgFhVencimiento,
      idUsuario: this._userService.user.ID_USER
    }
    this.spinner.show();
    this._registerService.registerDocUnidad(documento).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  cancel() {
    console.log('holsa')
    this.nombreDocumento = '';
    this.idTipoDocumento = 1;
    this.cantDias = 1;
    this.fgFhVencimiento = 1;
  }

  async modificarDoc(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let documento = {
      idDocumento: this.documentos[i].ID_DOCUMENTO,
      nombreDocumento: this.documentos[i].DS_DOCUMENTO,
      idTipoDocumento: this.documentos[i].ID_TIPO_DOCUMENTO,
      idCantDias: this.documentos[i].ID_CANT_DIAS,
      fgFhVencimiento: this.documentos[i].FG_FH_VENCIMIENTO,
      idUsuario: this._userService.user.ID_USER
    }
    this.spinner.show();
    this._registerService.updateDocUnidad(documento).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async eliminarDoc(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    this._registerService.deleteDocUnidad(id).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async getExelDocumentosUnidad() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.spinner.show();
    this._registerService.getExelDocumentosUnidad().subscribe(
      (response: any) => {
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `documentosUnidad.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
