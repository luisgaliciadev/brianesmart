import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UploadFileService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-homologacion-unidad',
  templateUrl: './homologacion-unidad.component.html',
  styles: [
  ]
})
export class HomologacionUnidadComponent implements OnInit {
  clientes = [];
  RUC = '';
  idCliente = 0;
  documentos = [];
  idDocumento = 0;
  documentosUnidad = [];
  totalRegistros = 0;
  extesion = ['png','PNG','jpeg','JPEG','jpg','JPG','pdf','txt','docx','xlsx', 'pptx']; 
  imageUpload: File;
  tempImage: string;
  idRelacion = 0;
  archivo = null;
  URL = environment.URL_SERVICES;
  idUnidad = 0;
  tipoVehiculo = '';
  placa = '';

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private _ngbModal: NgbModal,
    private _uploadFileService: UploadFileService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
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
    this.limpiarDataUnidad();
    const dataCliente = this.clientes.find( cliente => cliente.RUC === this.RUC);
    if (dataCliente) {
      this.idCliente = dataCliente.ID_CLIENTE;
    }
  }

  rucCliente() {
    if (this.idCliente == 0) {
      this.RUC = '';
      return;
    }
    this.limpiarDataUnidad();
    const dataCliente = this.clientes.find( cliente => cliente.ID_CLIENTE == this.idCliente);
    if (dataCliente) {
      this.RUC = dataCliente.RUC;
    }
  }

  async getUnidad() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.placa === '') {
      Swal.fire('Mensaje', 'Debe ingresar una placa.', 'warning');
      this.idUnidad = 0;
      this.tipoVehiculo = '';
      this.documentosUnidad = [];
      return;
    }
    this.spinner.show();
    this._registerService.getUnidad(this.placa).subscribe(
      (response: any) => {       
        this.idUnidad = response.unidad.ID_VEHICULO;
        this.tipoVehiculo = response.unidad.DS_TIPO_VEHICULO;
        this.getDocUnidadTotal();
        this.spinner.hide();
      }, 
      (error: any) => {
        this.idUnidad = 0;
        this.tipoVehiculo = '';
        this.documentosUnidad = [];
        this.spinner.hide();
      }
    );
  }

  async getDocUnidadTotal() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._registerService.getDocUnidadTotal(0, this.idUnidad).subscribe(
      (response: any) => {
        this.documentosUnidad = response.documentosUnidad;
        this.totalRegistros = this.documentosUnidad.length;
      }
    );
  }

  async registerDocUnidadRelacion(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if ( this.documentosUnidad[i].ID_RELACION_DOC_UNIDAD === 0) {
      let data = {
        idUnidad: this.documentosUnidad[i].ID_VEHICULO,
        idDocumento: this.documentosUnidad[i].ID_DOCUMENTO,
        idCliente: this.documentosUnidad[i].ID_CLIENTE,
        nroDocumento: this.documentosUnidad[i].NRO_DOCUMENTO,
        fhEmision: this.documentosUnidad[i].FH_EMISION,
        fhVencimiento: this.documentosUnidad[i].FH_VENCIMIENTO,
        idTipo: this.documentosUnidad[i].ID_TIPO_DOCUMENTO,
        idUsuario: this._userService.user.ID_USER,
        observacion: this.documentosUnidad[i].OBSERVACION
      }
      this.spinner.show();
      this._registerService.registerDocUnidadRelacion(data).subscribe(
        (response: any) => {
          this.getDocUnidadTotal();
          this.spinner.hide();
        },
        error => {
          this.documentosUnidad[i].FG_ACTIVO = false;
          this.spinner.hide();
        }
      );
    }
    if ( this.documentosUnidad[i].ID_RELACION_DOC_UNIDAD > 0) {
      var fgActivo;
      if (this.documentosUnidad[i].FG_ACTIVO || this.documentosUnidad[i].FG_ACTIVO === 1) {
        fgActivo = 1;
      }
      if (!this.documentosUnidad[i].FG_ACTIVO || this.documentosUnidad[i].FG_ACTIVO === 0) {
        fgActivo = 0;
      }
      let data = {
        idRelacionDocUnidad: this.documentosUnidad[i].ID_RELACION_DOC_UNIDAD,
        idConductor: this.documentosUnidad[i].ID_CONDUCTOR,
        idDocumento: this.documentosUnidad[i].ID_DOCUMENTO,
        idCliente: this.documentosUnidad[i].ID_CLIENTE,
        nroDocumento: this.documentosUnidad[i].NRO_DOCUMENTO,
        fhEmision: this.documentosUnidad[i].FH_EMISION,
        fhVencimiento: this.documentosUnidad[i].FH_VENCIMIENTO,
        idTipo: this.documentosUnidad[i].ID_TIPO_DOCUMENTO,
        idUsuario: this._userService.user.ID_USER,
        fgActivo,
        observacion: this.documentosUnidad[i].OBSERVACION
      }
      this.spinner.show();
      this._registerService.updateRelacionDocUnidad(data).subscribe(
        (response: any) => {
          this.getDocUnidadTotal();
          this.spinner.hide();
        },
        error => {
          this.documentosUnidad[i].FG_ACTIVO = false;
          this.spinner.hide();
        }
      );
    }    
  }

  async actualizarRegistro(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    var fgActivo;
    if (this.documentosUnidad[i].FG_ACTIVO || this.documentosUnidad[i].FG_ACTIVO === 1) {
      fgActivo = 1;
    }
    if (!this.documentosUnidad[i].FG_ACTIVO || this.documentosUnidad[i].FG_ACTIVO === 0) {
      fgActivo = 0;
    }
    let data = {
      idRelacionDocUnidad: this.documentosUnidad[i].ID_RELACION_DOC_UNIDAD,
      idUnidad: this.documentosUnidad[i].ID_VEHICULO,
      idDocumento: this.documentosUnidad[i].ID_DOCUMENTO,
      idCliente: this.documentosUnidad[i].ID_CLIENTE,
      nroDocumento: this.documentosUnidad[i].NRO_DOCUMENTO,
      fhEmision: this.documentosUnidad[i].FH_EMISION,
      fhVencimiento: this.documentosUnidad[i].FH_VENCIMIENTO,
      idTipo: this.documentosUnidad[i].ID_TIPO_DOCUMENTO,
      idUsuario: this._userService.user.ID_USER,
      fgActivo,
      observacion: this.documentosUnidad[i].OBSERVACION
    }
    this.spinner.show();
    this._registerService.updateRelacionDocUnidad(data).subscribe(
      (response: any) => {
        this.getDocUnidadTotal();
        this.spinner.hide();
      },
      error => {
        this.getDocUnidadTotal();
        this.spinner.hide();
      }
    );
  }

  datosDocumento(i, modal) {
    this.idDocumento = this.documentosUnidad[i].ID_DOCUMENTO;
    this.idRelacion = this.documentosUnidad[i].ID_RELACION_DOC_UNIDAD;
    this._ngbModal.open(modal);
  }

  selectImage(file: File) {
    if (!file) {
      this.imageUpload = null;
      return;
    } else {
      var fileName = file.name.split('.');
      var extFile = fileName[fileName.length - 1];  
      if (this.extesion.indexOf(extFile) < 0) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }
      if (file.size > 10000000) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tamaño del archivo no debe superar los 10 MB', 'warning');
        return;
      }
      this.imageUpload = file;
      let reader = new FileReader();
      let urlImageTemp = reader.readAsDataURL(file);
      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  changeImage(modal) {
    let idUnidad = this.placa;
    let idRelacion = this.idRelacion;    
    this._uploadFileService.uploadFile(this.imageUpload, 'documentos-unidad', idRelacion, idUnidad)
    .then( (resp: any) => {
      Swal.fire('Mensaje', 'Archivo Actualizado Correctamente', 'success');
      this.getDocUnidadTotal();
      this.cancel(modal)
    })
    .catch( resp => {
      Swal.fire('Error', 'No se pudo subir el archivo', 'warning');
      this.cancel(modal);
    });
  }

  cancel(modal) {
    this.idRelacion = 0;
    this.idDocumento = 0;
    this.imageUpload = null;
    (<HTMLInputElement>document.getElementById('archivo')).value = '';
    this.cerrarModal(modal);
  }

  cerrarModal(modal) {
    this._ngbModal.dismissAll(modal);
  }

  limpiarDataUnidad() {
    this.idUnidad = 0;
    this.placa = '';
    this.tipoVehiculo = '';
    this.totalRegistros = 0;
    this.documentosUnidad = [];
  }

  async verDocumento(archivo) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    window.open(this.URL +'/image/documentos-unidad/' + archivo);
  }
}
