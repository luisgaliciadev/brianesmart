import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-documentos-conductor',
  templateUrl: './documentos-conductor.component.html',
  styles: [
  ]
})
export class DocumentosConductorComponent implements OnInit {
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
    this.getTipoDocumentosConductor();
    this.getDiasTramiteUnidadCond();
    this.getDocumentos();
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
    this._registerService.getDocConductores(this.search).subscribe(
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

    if (!data.idTipoDocumento) {
      Swal.fire('Mensaje', 'Debe ingresar un tipo de documento.', 'warning');
      return;
    }

    if (!data.cantDias) {
      Swal.fire('Mensaje', 'Debe ingresar los dias de tramite.', 'warning');
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
    this._registerService.registerDocConductor(documento).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getTipoDocumentosConductor() {
    this.spinner.show();
    this._registerService.getTipoDocumentosConductor().subscribe(
      (response: any) => {
        this.tipoDocumentos = response.tipoDocumentosConductor;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      }
    );
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

  cancel() {
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
    this._registerService.updateDocConductor(documento).subscribe(
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
    this._registerService.deleteDocConductor(id).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async getExelDocumentosConductor() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.spinner.show();
    this._registerService.getExelDocumentosConductor().subscribe(
      (response: any) => {
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `documentosConductor.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
