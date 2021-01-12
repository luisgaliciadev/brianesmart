import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService, UploadFileService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { Peaje } from 'src/app/models/peaje.model';
import {saveAs} from 'file-saver';
import { URL_SERVICES } from '../../config/config';

@Component({
  selector: 'app-peaje',
  templateUrl: './peaje.component.html',
  styles: [
  ]
})
export class PeajeComponent implements OnInit {
  peaje: Peaje = new Peaje(0,0,0,0,'');
  idOrderSevicio = 0;
  idPeaje = 0;
  tipoServicio = '';
  producto = '';
  cliente = '';
  origen = '';
  destino = '';
  idConductor = '';
  nombreConductor = '';
  loading = true;
  ordenes = [];
  date = new Date();
  mes;
  dia;
  registrando = false;
  modificar = false;
  conductores = []
  montoPeaje = 0;
  fechaPeaje = '';
  dniConductor = '';
  facturas = false;
  nroDocumento = '';
  fechaDoc = '';
  montoDoc = 0;
  nroGuia = '';
  idGuia = 0;
  idDeta = 0;
  peajeFacturas = [];
  conductor = '';
  documentosPeaje = [];
  idTipoDocPeaje = 0;
  idAccion = 0;
  depositado;
  valorI;
  extesion = ['png','PNG','jpeg','JPEG','jpg','JPG','pdf']; 
  imageUpload: File;
  tempImage: string;
  URL = URL_SERVICES;

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute,
    private _uploadFileService: UploadFileService
  ) 
  { 
  }

  ngOnInit(): void {
    // this._userService.permisoModule(this._router.url);
    this._route.params.forEach((params: Params) => {
      this.peaje.ID_PEAJE = params.id;
      this.idAccion = params.fact;
      if (params.fact != 1 && params.fact != 2 && params.fact != 0) {
        Swal.fire('Mensaje', 'Registro de peaje no existe', 'error');
        this._router.navigate(['/peajes']);
      }

      if (params.fact == 1 || params.fact == 2) {
        this.facturas = true;
        this.getDocPeajes();
      }


      if (this.peaje.ID_PEAJE > 0) {
        this.modificar = true;
        this.getPeaje();
        this.getOrdenesServicioAll(); 
      } else {
        this.getOrdenesServicioAll();
      }
    });

    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();
    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }
    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }
    
  }

  getPeaje() {
    this._registerService.getPeaje(this.peaje.ID_PEAJE).subscribe(
      (response: any) => {
        this.peaje.MONTO_TOTAL = response.peaje.MONTO_TOTAL;
        this.peaje.CANT_REGISTROS = response.peaje.CANT_REGISTROS;
        this.peaje.ID_ORDEN_SERVICIO = response.peaje.ID_ORDEN_SERVICIO;
        this.peaje.OBSERVACION = response.peaje.OBSERVACION;
        this.peaje.ESTATUS = response.peaje.ESTATUS;
        var detaPeajes = [];
        response.detaPeajes.forEach(function (detalle) { 
            let fecha = detalle.FECHA.toString();
            let arrayFecha = fecha.split('-');
            fecha = arrayFecha[0] + '-' + arrayFecha[1] + '-' + arrayFecha[2].substring(0, 2);
            detaPeajes.push({
              idConductor: detalle.ID_CONDCUTOR,
              nombre: detalle.NOMBRE_APELLIDO,
              dni: detalle.IDENTIFICACION,
              monto: detalle.MONTO,
              fecha: fecha,
              peaje: '',
              idOrderSevicio: detalle.ID_ORDEN_SERVICIO,
              ID_DETA: detalle.ID_DETA_PEAJE,
              montoAbono: detalle.ABONO,
              montoSustentar: detalle.TOTAL_SUSTENTAR,
              depositado: detalle.FG_DEPOSITADO
            });
        });
        this.conductores = detaPeajes;
      }
    );
  }

  getDocPeajes () {
    this._registerService.getDocPeajes().subscribe(
      (response: any) => {       
        this.documentosPeaje = response.documentosPeaje;
      }
    );
  }

  async registerPeaje() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if ( this.peaje.ID_ORDEN_SERVICIO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una orden de servicio', 'warning');
      return;
    }

    if (this.conductores.length === 0) {
      Swal.fire('Mensaje', 'Debe ingresar al menos un conductor.', 'warning');
      return;
    }

    this.registrando = true;
    this.peaje.ID_USUARIO_BS = this._userService.user.ID_USER;
    let peajes = {
      peaje: this.peaje,
      detaPeaje: this.conductores
    };
    this._registerService.registerPeaje(peajes).subscribe(
      (response: any) => {
        this.registrando = false;
        this._router.navigate(['/peajes']);
      },
      error => {
        this.registrando = false;
      }
    );
  }

  async updatePeaje() { 
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if ( this.peaje.ID_ORDEN_SERVICIO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una orden de servicio', 'warning');
      return;
    } 
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Modificar Registro',
      text: "¿Desea modificar este registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.peaje.ID_USUARIO_BS = this._userService.user.ID_USER;
        let peajes = {
          peaje: this.peaje,
          detaPeaje: this.conductores
        };
        this._registerService.updatePeaje(peajes).subscribe(
          (response: any) => {
            this.getPeaje();
          }
        );
      } 
    });
  }

  async deletePeaje() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Anular Registro',
      text: "¿Desea anular este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._registerService.deletePeaje(this.peaje.ID_PEAJE).subscribe(
          (response: any) => {
            this._router.navigate(['/peajes']);
          }
        );
      } 
    });
  }

  getOrdenesServicioAll() {
    this.loading = true;
    this._registerService.getOrdenServicioAll(0).subscribe(
      (response: any) => {         
        this.ordenes = response.ordenesServicio;  
        // console.log(this.ordenes); 
        if (this.peaje.ID_PEAJE > 0) {
           this.datosOrden(this.peaje.ID_ORDEN_SERVICIO);   
        }
        this.loading = false;
      },
      (error: any) => {
          this.ordenes = [];
      }
    );
  }

  datosOrden(idOrden) {
    const orden = this.ordenes.find( orden => orden.ID_ORDEN_SERVICIO == idOrden );
    if (orden) {
      this.tipoServicio = orden.DS_TIPO_SERVICIO;
      this.producto = orden.DS_PRODUCTO;
      this.cliente = orden.RAZON_SOCIAL;
      this.origen = orden.DS_ORI_DEST;
      this.destino = orden.DESTINO;
    } else {
      this.peaje.ID_ORDEN_SERVICIO = 0;
    }
  }

  async getConductor(id) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (id === '') {
      return;
    }
    this._registerService.getConductor(id).subscribe(
      (response: any) => {
        this.dniConductor = response.conductor.ID_Chofer;
        this.nombreConductor = response.conductor.Nombre;
        this.idConductor = response.conductor.ID_CONDUCTOR;
      },
      error => {
        this.idConductor = '';
        this.nombreConductor = '';
      }
    );
  }

  async agregarConductor() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if ( this.peaje.ID_ORDEN_SERVICIO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar una orden de servicio', 'warning');
      return;
    }

    if ( this.nombreConductor === '' ||  this.idConductor === '') {
      Swal.fire('Mensaje', 'Debe seleccionar un conductor', 'warning');
      return;
    }

    if ( this.montoPeaje == 0 ||  this.fechaPeaje === '') {
      Swal.fire('Mensaje', 'Existen campos vacios', 'warning');
      return;
    }

    const resultado = this.conductores.find( iden => iden.idConductor === this.idConductor);
    if(resultado) {
      Swal.fire('Mensaje', 'El conductor ya esta agregado en la lista', 'warning');
      return;
    }

    let arrayFecha = this.fechaPeaje.split('/');

    if (parseInt(arrayFecha[0]) < 2000) {
      Swal.fire('Mensaje', 'Fecha incorrecta.', 'warning');
      return;
    }

    if (this.peaje.ID_PEAJE == 0) {
      this.conductores.push({
        idConductor: this.idConductor,
        nombre: this.nombreConductor,
        dni: this.dniConductor,
        monto: this.montoPeaje,
        fecha: this.fechaPeaje,
        peaje: '',
        idOrderSevicio: this.idOrderSevicio,
        ID_DETA: 0,
        montoAbono: 0,
        montoSustentar: 0,
        depositado: 0
      });
  
      var montoTotal = 0;
      this.conductores.forEach(function (peaje) { 
        montoTotal = montoTotal + peaje.monto;
      });
      this.peaje.MONTO_TOTAL = montoTotal;
      this.peaje.CANT_REGISTROS = this.conductores.length;
  
      this.nombreConductor = '';
      this.idConductor = '';
      this.montoPeaje = 0;
      this.fechaPeaje = '';
      this.dniConductor = '';
    } else {
      var detaPeaje = {
        idPeaje: this.peaje.ID_PEAJE,
        idConductor: this.idConductor,
        monto: this.montoPeaje,
        fecha: this.fechaPeaje,
        idUser: this._userService.user.ID_USER
      };

      this._registerService.registerDetaPeaje(detaPeaje).subscribe(
        (response: any) => {
          var idDetaPeaje = response.detaPeaje.ID_DETA_PEAJE;
          this.conductores.push({
            idConductor: this.idConductor,
            nombre: this.nombreConductor,
            dni: this.dniConductor,
            monto: this.montoPeaje,
            fecha: this.fechaPeaje,
            peaje: '',
            idOrderSevicio: this.idOrderSevicio,
            ID_DETA: idDetaPeaje,
            montoAbono: 0,
            montoSustentar: 0,
            depositado: 0
          });
      
          var montoTotal = 0;
          this.conductores.forEach(function (peaje) { 
            montoTotal = montoTotal + peaje.monto;
          });
          this.peaje.MONTO_TOTAL = montoTotal;
          this.peaje.CANT_REGISTROS = this.conductores.length;
      
          this.nombreConductor = '';
          this.idConductor = '';
          this.montoPeaje = 0;
          this.fechaPeaje = '';
          this.dniConductor = '';
        }
      );
    }
  }

  async eliminarConductor(i, idDeta) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Eliminar Registro',
      text: "¿Desea eliminar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (idDeta > 0) {
          this._registerService.deleteDetaPeaje(this.peaje.ID_PEAJE, idDeta).subscribe(
            (response: any) => {
              this.conductores.splice(i, 1);
              var montoTotal = 0;
              this.conductores.forEach(function (peaje) { 
                montoTotal = montoTotal + peaje.monto;
              });
              this.peaje.MONTO_TOTAL = montoTotal;
              this.peaje.CANT_REGISTROS = this.conductores.length;
            }
          );
        } else {
          this.conductores.splice(i, 1);
        } 
      } 
    });
  }

  async registrarFact() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.idTipoDocPeaje == 0) {
      Swal.fire('Error', 'No se realizo el registro, debe llenar todos los campos.', 'warning');
      return;
    }

    if (this.idTipoDocPeaje == 1 && (this.nroDocumento === '' || this.fechaDoc === '' || this.montoDoc == 0 || this.idGuia == 0)) {
      Swal.fire('Error', 'No se realizo el registro, debe llenar todos los campos.', 'warning');
      return;
    }

    if (this.idTipoDocPeaje > 1 && this.nroDocumento === '' || this.fechaDoc === '' || this.montoDoc == 0) {
      Swal.fire('Error', 'No se realizo el registro, debe llenar todos los campos.', 'warning');
      return;
    }

    // this.registrando = true;
    let factura = {
      idPeaje: this.peaje.ID_PEAJE,
      idDetallePeaje: this.idDeta,
      numero: this.nroDocumento,
      monto: this.montoDoc,
      fecha: this.fechaDoc,
      idGuia: this.idGuia,
      idUser : this._userService.user.ID_USER,
      idTipoDoc: this.idTipoDocPeaje
    }
    this.registrando = true;
    this._registerService.registePeajeFact(factura).subscribe(
      (response: any) => {
        this.changeImage(response.peajeFactura.ID_RELACION_PEAJES,response.peajeFactura.ID_PEAJE);
        this.getPeaje();
        this.limpiarModal();
        this.registrando = false;
        // this.registrando = false;
      },
      error => {
        this.limpiarModal();
        this.registrando = false;
        // this.registrando = false;
      }
    );
  }

  valorIdDeta (idDetalle, i) {
    this.idDeta = idDetalle;
    this.valorI = i;
  }

  limpiarModal() {
    this.nroDocumento = '';
    this.fechaDoc = '';
    this.montoDoc = 0;
    this.nroGuia = '';
    this.idGuia = 0;
    this.idTipoDocPeaje = 0;
  }

  getPeajesFacturas(idDeta, dni, conductor) {
    this.conductor = '';
    this._registerService.getPeajeFacturas(idDeta).subscribe(
      (response: any) => {
        this.getPeaje();
        this.peajeFacturas = response.peajesFacturas;
        this.conductor = dni + ' - ' + conductor;
      }
    );
  }

  getVerificarNroGuia(correlativo) {
    if (correlativo === '') {
      return;
    }
   
    this._registerService.getVerificarNroGuia(correlativo, this.conductores[this.valorI].dni).subscribe(
      (response: any) => {
        this.idGuia = response.guia.ID_GUIA
      },
      (error: any) => {
        this.idGuia = 0;
      }
    );
  }

  async deletePeajeFact(id, idDeta, dni, conductor) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Eliminar Registro',
      text: "¿Desea eliminar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (id > 0) {
          this.registrando = true;
          this._registerService.deletePeajeFact(id).subscribe(
            (response: any) => {
              this.getPeajesFacturas(idDeta, dni, conductor);
              this.getPeaje();
              this.registrando = false;
            }, 
            error => {
              this.registrando = false;
            }
          );
        }
      } 
    });
  }

  async updateDetaPeaje(idDeta,i) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    var valor = 0;
    if (this.conductores[i].depositado) {
      valor = 1;
    }
    this._registerService.updateDetaPeaje(idDeta, valor).subscribe(
      (response: any) => {
      },
      error => {
        if (valor = 1) {
          this.conductores[i].depositado = true;
        } else {
          this.conductores[i].depositado = false;
        }
      }
    );
  }

  async updateAllDetaPeaje(valor) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._registerService.updateAllDetaPeaje(this.peaje.ID_PEAJE, valor).subscribe(
      (response: any) => {
        this.getPeaje();
      }
    );
  }

  async getExcelPeajeTelecredito() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._registerService.getExcelPeajeTelecredito(this.peaje.ID_PEAJE).subscribe(
      (response: any) => {
        let fileBlob = response;
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `${this.peaje.ID_PEAJE}-solicitudPeajes.xlsx`);
      }
    );
  }

  async procesarSolicitud() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    var fgDepositado;
    this.conductores.forEach(function (detalle) { 
        if (detalle.depositado) {
          fgDepositado = detalle.depositado;
        }
    });   

    if (!fgDepositado) {
      Swal.fire('Mensaje', 'Debe marcar los peajes depositados.', 'warning');
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Procesar Registro',
      text: "¿Desea procesar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registrando = true;
        this._registerService.procesarPeaje(this.peaje.ID_PEAJE).subscribe(
          (response: any) => {
            if (response) {
              this.getPeaje();
              this.registrando = false;
            }
          },
          (error: any) => {
            this.registrando = false;
          }
        );
      } 
    });
  }

  async liquidarSolicitud() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    // var fgDepositado;
    // this.conductores.forEach(function (detalle) { 
    //     if (detalle.depositado) {
    //       fgDepositado = detalle.depositado;
    //     }
    // });   

    // if (!fgDepositado) {
    //   Swal.fire('Mensaje', 'Debe marcar los peajes depositados.', 'warning');
    //   return;
    // }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })    
    swalWithBootstrapButtons.fire({
      title: 'Liquidar Registro',
      text: "¿Desea liquidar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registrando = true;
        this._registerService.liquidarPeaje(this.peaje.ID_PEAJE).subscribe(
          (response: any) => {
            if (response) {
              this.getPeaje();
              this.registrando = false;
            }
          },
          (error: any) => {
            this.registrando = false;
          }
        );
      } 
    });
  }

  async printer() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.loadReport();
    window.open('#/resumenpeaje/' + this.peaje.ID_PEAJE, '0' , '_blank');
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
        (<HTMLInputElement>document.getElementById('archivo')).value = '';
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }

      if (file.size > 10000000) {
        this.imageUpload = null;
        (<HTMLInputElement>document.getElementById('archivo')).value = '';
        Swal.fire('Mensaje', 'Disculpe, tamaño del archivo no debe superar los 10 MB', 'warning');
        return;
      }

      this.imageUpload = file;
      let reader = new FileReader();
      let urlImageTemp = reader.readAsDataURL(file);
      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  changeImage(idRelacionPeaje, idPeaje) {    
    this._uploadFileService.uploadFile(this.imageUpload, 'facturas-peaje', idRelacionPeaje, idPeaje)
    .then( (resp: any) => {
      (<HTMLInputElement>document.getElementById('archivo')).value = '';
      // Swal.fire('Mensaje', 'Archivo Actualizado Correctamente', 'success');
    })
    .catch( resp => {
      Swal.fire('Error', 'No se pudo subir el archivo', 'warning');
    });
  }

  async verDocumento(archivo) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    window.open(this.URL +'/image/facturas-peaje/' + archivo);
  }

}


       