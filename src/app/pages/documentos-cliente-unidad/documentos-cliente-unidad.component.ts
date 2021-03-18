import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos-cliente-unidad',
  templateUrl: './documentos-cliente-unidad.component.html',
  styles: [
  ]
})
export class DocumentosClienteUnidadComponent implements OnInit {
  loading = false;
  clientes = [];
  RUC = '';
  idCliente = 0;
  documentos = [];
  idDocumento = 0;
  documentosCliente = [];
  totalRegistros = 0;
  busqueda = false;
  resgistrado = false;
  dniConductor = '';
  nombreConductor = '';

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getClientes();
    this.getDocumentos();
  }

  getClientes() {
    this.loading = true;
    this._registerService.getClientes().subscribe(
      (response: any) => {
        this.clientes = response.clientes;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
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
    this.loading = true;
    this._registerService.getDocUnidadesCliente(0).subscribe(
      (response: any) => {
        this.documentos = response.documentos;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
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

    this.resgistrado = true;
    let data = {
      idDocumento: this.idDocumento,
      idCliente: this.idCliente,
      idUsuario: this._userService.user.ID_USER
    }

    this._registerService.registerDocClienteUnidad(data).subscribe(
      (response: any) => {
        this.getDocClientesUnidad(this.idCliente);
        this.idDocumento = 0;
        this.resgistrado = false;
      },
      error => {
        this.resgistrado = false;
      }
    );
  }

  async getDocClientesUnidad(idCliente) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.busqueda = true;
    this._registerService.getDocClientesUnidad(idCliente).subscribe(
      (response: any) => {
        this.documentosCliente = response.documentosClienteUnidad;
        this.totalRegistros = this.documentosCliente.length;
        this.busqueda = false;
      },
      (error:any) => {
        this.busqueda = false;
      }
    );
  }

  async borrarDocumento(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.resgistrado = true;
    this._registerService.deleteDocClienteUnidad(id).subscribe(
      (response: any) => {
        this.getDocClientesUnidad(this.idCliente);
        this.resgistrado = false;
      },
      error => {
        this.resgistrado = false;
      }
    );
  }

}
