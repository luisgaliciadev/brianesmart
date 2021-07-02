import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos-cliente-unidad',
  templateUrl: './documentos-cliente-unidad.component.html',
  styles: [
  ]
})
export class DocumentosClienteUnidadComponent implements OnInit {
  clientes = [];
  RUC = '';
  idCliente = 0;
  documentos = [];
  idDocumento = 0;
  documentosCliente = [];
  totalRegistros = 0;
  dniConductor = '';
  nombreConductor = '';

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getClientes();
    this.getDocumentos();
  }

  getClientes() {
    this.spinner.show();
    this._registerService.getClientes().subscribe(
      (response: any) => {
        this.clientes = response.clientes;
        this.spinner.hide();
      },
      (error:any) => {
        this.spinner.hide();
      }
    );
  }

  buscarClienteRuc() {
    if (this.RUC.length === 0) {
      return;
    }
    const dataCliente = this.clientes.find( cliente => cliente.RUC === this.RUC);
    if (dataCliente) {
      this.idCliente = dataCliente.ID_CLIENTE;
      this.getDocClientesUnidad(this.idCliente);
    }
  }

  rucCliente() {
    if (this.idCliente == 0) {
      this.RUC = '';
      return;
    }
    const dataCliente = this.clientes.find( cliente => cliente.ID_CLIENTE == this.idCliente);
    if (dataCliente) {
      this.RUC = dataCliente.RUC;
      this.getDocClientesUnidad(this.idCliente);
    }
  }

  getDocumentos() {
    this.spinner.show();
    this._registerService.getDocUnidadesCliente(0).subscribe(
      (response: any) => {
        this.documentos = response.documentos;
        this.spinner.hide();
      },
      (error:any) => {
        this.spinner.hide();
      }
    );
  }

  async registerDoc() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    
    if (this.idCliente == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un cliente.', 'warning');
      return;
    }

    if (this.idDocumento == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un documento.', 'warning');
      return;
    }

    this.spinner.show();
    let data = {
      idDocumento: this.idDocumento,
      idCliente: this.idCliente,
      idUsuario: this._userService.user.ID_USER
    }

    this._registerService.registerDocClienteUnidad(data).subscribe(
      (response: any) => {
        this.getDocClientesUnidad(this.idCliente);
        this.idDocumento = 0;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async getDocClientesUnidad(idCliente) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    this._registerService.getDocClientesUnidad(idCliente).subscribe(
      (response: any) => {
        this.documentosCliente = response.documentosClienteUnidad;
        this.totalRegistros = this.documentosCliente.length;
        this.spinner.hide();
      },
      (error:any) => {
        this.spinner.hide();
      }
    );
  }

  async borrarDocumento(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.spinner.show();
    this._registerService.deleteDocClienteUnidad(id).subscribe(
      (response: any) => {
        this.getDocClientesUnidad(this.idCliente);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
