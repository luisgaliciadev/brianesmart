import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, UploadFileService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-homologacion-conductor',
  templateUrl: './homologacion-conductor.component.html',
  styles: [
  ]
})
export class HomologacionConductorComponent implements OnInit {
  loading = false;
  clientes = [];
  RUC = '';
  idCliente = 0;
  documentos = [];
  idDocumento = 0;
  documentosConductor = [];
  totalRegistros = 0;
  busqueda = false;
  resgistrado = false;
  dniConductor = '';
  nombreConductor = '';
  idConductor = 0;
  extesion = ['png','PNG','jpeg','JPEG','jpg','JPG','pdf','txt','docx','xlsx', 'pptx']; 
  imageUpload: File;
  tempImage: string;
  idRelacion = 0;
  archivo = null;
  URL = environment.URL_SERVICES;

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
    this.limpiarDataConductor();
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
    this.limpiarDataConductor();
    const dataCliente = this.clientes.find( cliente => cliente.ID_CLIENTE == this.idCliente);
    if (dataCliente) {
      this.RUC = dataCliente.RUC;
    }
  }

  async getConductor(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (id === '') {
      Swal.fire('Mensaje', 'Debe ingresar el dni del conductor.', 'warning');
      this.dniConductor = '';
      this.nombreConductor = '';
      this.idConductor = 0;
      this.documentosConductor = [];
      return;
    }

    this.spinner.show();
    this._registerService.getConductor(id).subscribe(
      (response: any) => {
        this.dniConductor = response.conductor.ID_Chofer;
        this.nombreConductor = response.conductor.Nombre;
        this.idConductor = response.conductor.ID_CONDUCTOR;
        this.getDocConductorTotal();
        this.spinner.hide();
      },
      error => {
        this.idConductor = 0;
        this.nombreConductor = '';
        this.documentosConductor = [];
        this.spinner.hide();
      }
    );
  }

  async getDocConductorTotal() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._registerService.getDocConductorTotal(0, this.idConductor).subscribe(
      (response: any) => {
        this.documentosConductor = response.documentosConductor;
        this.totalRegistros = this.documentosConductor.length;
      }
    );
  }

  async registerDocConductorRelacion(i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if ( this.documentosConductor[i].ID_RELACION_DOC_COND === 0) {
      let data = {
        idConductor: this.documentosConductor[i].ID_CONDUCTOR,
        idDocumento: this.documentosConductor[i].ID_DOCUMENTO,
        idCliente: this.documentosConductor[i].ID_CLIENTE,
        nroDocumento: this.documentosConductor[i].NRO_DOCUMENTO,
        fhEmision: this.documentosConductor[i].FH_EMISION,
        fhVencimiento: this.documentosConductor[i].FH_VENCIMIENTO,
        idTipo: this.documentosConductor[i].ID_TIPO_DOCUMENTO,
        idUsuario: this._userService.user.ID_USER,
        observacion: this.documentosConductor[i].OBSERVACION
      }
      this.spinner.show();
      this._registerService.registerDocConductorRelacion(data).subscribe(
        (response: any) => {
          this.getDocConductorTotal();
          this.spinner.hide();
        },
        error => {
          this.documentosConductor[i].FG_ACTIVO = false;
          this.spinner.hide();
        }
      );
    }
    if ( this.documentosConductor[i].ID_RELACION_DOC_COND > 0) {
      var fgActivo;
      if (this.documentosConductor[i].FG_ACTIVO || this.documentosConductor[i].FG_ACTIVO === 1) {
        fgActivo = 1;
      }
      if (!this.documentosConductor[i].FG_ACTIVO || this.documentosConductor[i].FG_ACTIVO === 0) {
        fgActivo = 0;
      }
      let data = {
        idRelacionDocConductor: this.documentosConductor[i].ID_RELACION_DOC_COND,
        idConductor: this.documentosConductor[i].ID_CONDUCTOR,
        idDocumento: this.documentosConductor[i].ID_DOCUMENTO,
        idCliente: this.documentosConductor[i].ID_CLIENTE,
        nroDocumento: this.documentosConductor[i].NRO_DOCUMENTO,
        fhEmision: this.documentosConductor[i].FH_EMISION,
        fhVencimiento: this.documentosConductor[i].FH_VENCIMIENTO,
        idTipo: this.documentosConductor[i].ID_TIPO_DOCUMENTO,
        idUsuario: this._userService.user.ID_USER,
        fgActivo,
        observacion: this.documentosConductor[i].OBSERVACION
      }
      this.spinner.show();
      this._registerService.updateDocCondcutor(data).subscribe(
        (response: any) => {
          this.getDocConductorTotal();
          this.spinner.hide();
        },
        error => {
          this.documentosConductor[i].FG_ACTIVO = false;
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
    if (this.documentosConductor[i].FG_ACTIVO || this.documentosConductor[i].FG_ACTIVO === 1) {
      fgActivo = 1;
    }
    if (!this.documentosConductor[i].FG_ACTIVO || this.documentosConductor[i].FG_ACTIVO === 0) {
      fgActivo = 0;
    }
    let data = {
      idRelacionDocConductor: this.documentosConductor[i].ID_RELACION_DOC_COND,
      idConductor: this.documentosConductor[i].ID_CONDUCTOR,
      idDocumento: this.documentosConductor[i].ID_DOCUMENTO,
      idCliente: this.documentosConductor[i].ID_CLIENTE,
      nroDocumento: this.documentosConductor[i].NRO_DOCUMENTO,
      fhEmision: this.documentosConductor[i].FH_EMISION,
      fhVencimiento: this.documentosConductor[i].FH_VENCIMIENTO,
      idTipo: this.documentosConductor[i].ID_TIPO_DOCUMENTO,
      idUsuario: this._userService.user.ID_USER,
      fgActivo,
      observacion: this.documentosConductor[i].OBSERVACION
    }
    this.spinner.show();
    this._registerService.updateDocCondcutor(data).subscribe(
      (response: any) => {
        this.getDocConductorTotal();
        this.spinner.hide();
      },
      error => {
        this.getDocConductorTotal();
        this.spinner.hide();
      }
    );
  }

  datosDocumento(i, modal) {
    this.idDocumento = this.documentosConductor[i].ID_DOCUMENTO;
    this.idRelacion = this.documentosConductor[i].ID_RELACION_DOC_COND;
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
    let idConductor = this.dniConductor;
    let idRelacion = this.idRelacion;    
    this._uploadFileService.uploadFile(this.imageUpload, 'documentos-conductor', idRelacion, idConductor)
    .then( (resp: any) => {
      Swal.fire('Mensaje', 'Archivo Actualizado Correctamente', 'success');
      this.getDocConductorTotal();
      this.cancel(modal)
    })
    .catch( resp => {
      Swal.fire('Error', 'No se pudo subir el archivo', 'warning');
      this.cancel(modal);
    });
  }


  limpiarDataConductor() {
    this.dniConductor = '';
    this.idConductor = 0;
    this.nombreConductor = '';
    this.totalRegistros = 0;
    this.documentosConductor = [];
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

  async verDocumento(archivo) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    window.open(this.URL +'/image/documentos-conductor/' + archivo);
  }
}
