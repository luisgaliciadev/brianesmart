import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';

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

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getDocumentos();
  }

  async getDocumentos() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.loading = true;
    if (this.search === '') {
      this.search = '0';
    }
    this._registerService.getDocConductores(this.search).subscribe(
      (response: any) => {
        this.documentos = response.documentos;
        this.totalRegistros = this.documentos.length;
        this.loading = false;
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
      idUsuario: this._userService.user.ID_USER
    }
    this.loading = true;
    this._registerService.registerDocConductor(documento).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.loading = false;
      }
    );
  }

  cancel() {
    this.nombreDocumento = '';
  }

  async modificarDoc(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let documento = {
      idDocumento: this.documentos[i].ID_DOCUMENTO,
      nombreDocumento: this.documentos[i].DS_DOCUMENTO,
      idUsuario: this._userService.user.ID_USER
    }
    this.loading = true;
    this._registerService.updateDocConductor(documento).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.loading = false;
      }
    );
  }

  async eliminarDoc(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.loading = true;
    this._registerService.deleteDocConductor(id).subscribe(
      (response: any) => {
        this.getDocumentos();
        this.cancel();
      },
      error => {
        this.loading = false;
      }
    );
  }

}
