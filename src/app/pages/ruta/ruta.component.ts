import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ruta } from 'src/app/models/ruta.model';
import { RegisterService, UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { NgxMaskModule, IConfig } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styles: [
  ]
})
export class RutaComponent implements OnInit {  
  loading = false;
  registrando = false;
  ruta: Ruta = new Ruta(0,'',0,0,0,0,0,0,'',0,0,0,0,[],[],'','',0,'','','','','',0,0,0,0,0);
  RUC = '';
  clientes = [];
  origenes = [];
  destinos = [];
  tipoCargas = [];
  productos = [];
  monedas = [];
  tipoCobrosOs = [];
  detaProductos = [];
  detaTipoCargas = [];

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _userService: UserService,
    public _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.getOrigenes();
    this.getDestinos();23
    this.getTipoCargas();
    this.getProductos();  
    this.getMonedas();  
    this.getTipoCobrosOs();
    this._route.params.forEach((params: Params) => {
      this.ruta.ID_RUTA = parseInt(params.id);
      if (this.ruta.ID_RUTA > 0) {
        this.getRuta();
      } else {
        this.ruta = new Ruta(0,'',0,0,0,0,0,0,'',0,0,0,0,[],[],'','',0,'','','','','',0,0,0,0,0);
      }
    });
  }

  async getRuta() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.loading = true;
    this._registerService.getRuta(this.ruta.ID_RUTA).subscribe(
      (response: any) => {
        // console.log(response)
        this.getDetaRutaTipoCargas();
        this.getDetaRutaProductos();
        this.ruta.ID_RUTA = response.ruta.ID_RUTA;
        this.ruta.ID_CLIENTE = response.ruta.ID_CLIENTE;
        this.ruta.ID_ORIGEN = response.ruta.ID_ORIGEN;
        this.ruta.ID_DESTINO = response.ruta.ID_DESTINO;
        this.ruta.DS_RUTA = response.ruta.DS_RUTA;
        this.ruta.ID_MONEDA = response.ruta.ID_MONEDA;
        this.ruta.TARIFA = response.ruta.TARIFA;
        this.ruta.ID_TIPO_CARGA = response.ruta.ID_TIPO_CARGA;
        this.ruta.ID_PRODUCTO = response.ruta.ID_PRODUCTO;
        this.ruta.OBSERVACION = response.ruta.OBSERVACION;
        this.ruta.ESTADO = response.ruta.ESTADO;
        this.ruta.ID_TIPO_COBRO_OS = response.ruta.ID_TIPO_COBRO_OS;
        this.ruta.ID_USUARIO = this._userService.user.ID_USER;
        this.ruta.HORA_INICIO = response.ruta.HORA_INICIO;
        this.ruta.HORA_FIN = response.ruta.HORA_FIN;
        this.ruta.KM = response.ruta.KM;
        this.ruta.IDA_HORAS = response.ruta.IDA_HORAS;
        this.ruta.RETORNO_HORAS = response.ruta.RETORNO_HORAS;
        this.ruta.ORIGEN_HORAS = response.ruta.ORIGEN_HORAS;
        this.ruta.DESTINO_HORAS = response.ruta.DESTINO_HORAS;
        this.ruta.LEADTIME_HORAS = response.ruta.LEADTIME_HORAS;
        this.ruta.LEADTIME_DIAS = response.ruta.LEADTIME_DIAS;
        this.ruta.COSTO_ESTIBA = response.ruta.COSTO_ESTIBA;
        this.ruta.PEAJES = response.ruta.PEAJES;
        this.ruta.COMBUSTIBLE_GLNS = response.ruta.COMBUSTIBLE_GLNS;
        this.ruta.REDIMIENTO_KM_GLNS = response.ruta.REDIMIENTO_KM_GLNS;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  // formatoHora(horaMinutos, nro) {    
  //   if (horaMinutos.length === 2) {
  //     let hora = horaMinutos.substring(0,2)
  //     if (hora > 23) {
  //       if (nro === 1) {
  //         this.ruta.HORA_INICIO = '23';
  //       }

  //       if (nro === 2) {
  //         this.ruta.HORA_FIN = '23';
  //       }
  //     }
  //   }
  // }

  getDetaRutaTipoCargas() {
    this._registerService.getDetaRutaTipoCargas(this.ruta.ID_RUTA).subscribe(
      (response: any) => {
        this.detaTipoCargas = response.detaTipoCargas;
      }
    );
  }

  getDetaRutaProductos() {
    this._registerService.getDetaRutaProductos(this.ruta.ID_RUTA).subscribe(
      (response: any) => {
        this.detaProductos = response.detaProductos;
      }
    );
  }

  getMonedas() {
    this.loading = true;
    this._registerService.getMonedas().subscribe(
      (response: any) => {
        this.monedas = response.monedas;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  getTipoCobrosOs() {
    this.loading = true;
    this._registerService.getTipoCobrosOs().subscribe(
      (response: any) => {
        this.tipoCobrosOs = response.tipoCobrosOs;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
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
      this.ruta.ID_CLIENTE = dataCliente.ID_CLIENTE;
    }
  }

  rucCliente() {
    console.log('this.ruta.ID_CLIENTE', this.ruta.ID_CLIENTE);
    if (this.ruta.ID_CLIENTE == 0) {
      this.RUC = '';
      return;
    }
    const dataCliente = this.clientes.find( cliente => cliente.ID_CLIENTE == this.ruta.ID_CLIENTE);
    if (dataCliente) {
      this.RUC = dataCliente.RUC;
    }
  }

  getOrigenes() {
    this.loading = true;
    this._registerService.getOrigenesDestinos(0).subscribe(
      (response: any) => {       
        this.origenes = response.origenesDestinos;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  getDestinos() {
    this.loading = true;
    this._registerService.getOrigenesDestinos(1).subscribe(
      (response: any) => {       
        this.destinos = response.origenesDestinos;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  getTipoCargas() {
    this.loading = true;
    this._registerService.getTipoCargas().subscribe(
      (response: any) => {       
        this.tipoCargas = response.tipoCargas;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  getProductos() {
    this.loading = true;
    this._registerService.getProductos().subscribe(
      (response: any) => {       
        this.productos = response.productos;
        this.loading = false;
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  horasLeadtime () {
    let horasLeadtime = ''
    let totalHorasLeadtime
    let horasIda = 0;
    let horasRetorno = 0;
    let horasOrigen = 0;
    let horasDestino = 0;
    let totalMinLeadtime
    let minIda = 0;
    let minRetorno = 0;
    let minOrigen = 0;
    let minDestino = 0;

    if (parseInt(this.ruta.IDA_HORAS.substring(0,2))) {
      horasIda = parseInt(this.ruta.IDA_HORAS.substring(0,2));
    }

    if (parseInt(this.ruta.RETORNO_HORAS.substring(0,2))) {
      horasRetorno = parseInt(this.ruta.RETORNO_HORAS.substring(0,2));
    }

    if (parseInt(this.ruta.ORIGEN_HORAS.substring(0,2))) {
      horasOrigen = parseInt(this.ruta.ORIGEN_HORAS.substring(0,2));
    }
   
    if (parseInt(this.ruta.DESTINO_HORAS.substring(0,2))) {
      horasDestino = parseInt(this.ruta.DESTINO_HORAS.substring(0,2));
    }

    if (parseInt(this.ruta.IDA_HORAS.substring(2))) {
      if (parseInt(this.ruta.IDA_HORAS.substring(2)) > 59) {
        this.ruta.IDA_HORAS = this.ruta.IDA_HORAS.substring(0,2) + '59';
      }
      minIda = parseInt(this.ruta.IDA_HORAS.substring(2));
    }

    if (parseInt(this.ruta.RETORNO_HORAS.substring(2))) {
      minRetorno = parseInt(this.ruta.RETORNO_HORAS.substring(2));
    }

    if (parseInt(this.ruta.ORIGEN_HORAS.substring(2))) {
      minOrigen = parseInt(this.ruta.ORIGEN_HORAS.substring(2));
    }
   
    if (parseInt(this.ruta.DESTINO_HORAS.substring(2))) {
      minDestino = parseInt(this.ruta.DESTINO_HORAS.substring(2));
    }

    let minutos = minIda + minRetorno + minOrigen + minDestino;
    let horasMin = (minutos / 60).toFixed(2);
    let arrayTotalHorasMin = horasMin.toString().split('.');
    let totalHorasMin = parseInt(arrayTotalHorasMin[0]);
    let totalMin = Math.ceil((parseInt(arrayTotalHorasMin[1]) * 59) / 99);
    totalHorasLeadtime = horasIda + horasRetorno + horasOrigen + horasDestino + totalHorasMin;
    totalMinLeadtime = totalMin;

    if (totalHorasLeadtime.toString().length < 2) {
      horasLeadtime = '0' + totalHorasLeadtime.toString();
    } else {
      horasLeadtime = totalHorasLeadtime.toString();
    }

    if (totalMinLeadtime.toString().length < 2) {
      totalMinLeadtime = '0' + totalMinLeadtime.toString();
    } else {
      totalMinLeadtime = totalMinLeadtime.toString();
    }
    
    this.ruta.LEADTIME_HORAS = '';
    this.ruta.LEADTIME_HORAS = horasLeadtime + ':' + totalMinLeadtime;
    this.ruta.LEADTIME_DIAS = Math.ceil((parseInt(horasLeadtime) + parseInt(totalMinLeadtime) / 60) / 24);
  }

  async registerRuta() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.ruta.ID_CLIENTE == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un cliente', 'warning');
      return;
    }

    if (this.ruta.ID_ORIGEN == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un origen', 'warning');
      return;
    }

    if (this.ruta.ID_DESTINO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un destino', 'warning');
      return;
    }

    if (this.detaTipoCargas.length === 0) {
      Swal.fire('Mensaje', 'Debe agregar al menos un tipo de carga', 'warning');
      return;
    }

    if (this.detaProductos.length === 0) {
      Swal.fire('Mensaje', 'Debe agregar al menos un producto', 'warning');
      return;
    }

    if (this.ruta.ID_TIPO_COBRO_OS == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un tipo de cobro', 'warning');
      return;
    }

    let horaInicio = parseInt(this.ruta.HORA_INICIO.substring(0,2));
    let minInicio = parseInt(this.ruta.HORA_INICIO.substring(2));
    let horaFin = parseInt(this.ruta.HORA_FIN.substring(0,2));
    let minFin = parseInt(this.ruta.HORA_FIN.substring(2));

    if (horaInicio > 23 || horaInicio < 0 || minInicio > 59 || minInicio <0) {
      Swal.fire('Mensaje', 'Formato de hora de inicio de atención incorrecto', 'warning');
      return;
    }

    if (horaFin > 23 || horaFin < 0 || minFin > 59 || minFin <0) {
      Swal.fire('Mensaje', 'Formato de hora de fin de atención incorrecto', 'warning');
      return;
    }

    if (parseInt(this.ruta.IDA_HORAS.substring(2)) > 59) {
      Swal.fire('Mensaje', 'Formato de minutos incorrecto en horas de ida', 'warning');
      return;
    }

    if (parseInt(this.ruta.RETORNO_HORAS.substring(2)) > 59) {
      Swal.fire('Mensaje', 'Formato de minutos incorrecto en horas de retorno', 'warning');
      return;
    }

    if (parseInt(this.ruta.ORIGEN_HORAS.substring(2)) > 59) {
      Swal.fire('Mensaje', 'Formato de minutos incorrecto en horas en origen', 'warning');
      return;
    }

    if (parseInt(this.ruta.DESTINO_HORAS.substring(2)) > 59) {
      Swal.fire('Mensaje', 'Formato de minutos incorrecto en horas en destino', 'warning');
      return;
    }

    this.ruta.ID_USUARIO = this._userService.user.ID_USER;   
    this.ruta.DETA_TIPO_CARGAS = this.detaTipoCargas;
    this.ruta.DETA_PRODUCTOS = this.detaProductos;
    console.log('ruta:',this.ruta);
    this.registrando = true;
    this._registerService.registerRuta(this.ruta).subscribe(
      (response: any) => {
        // console.log(response);
        this._router.navigate(['/ruta',response.ruta.ID_RUTA]);
        this.registrando = false;
      },
      (error: any) => {
        this.registrando = false;
      }
    );
  }

  async updateRuta() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.ruta.ID_CLIENTE == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un cliente', 'warning');
      return;
    }

    if (this.ruta.ID_ORIGEN == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un origen', 'warning');
      return;
    }

    if (this.ruta.ID_DESTINO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un destino', 'warning');
      return;
    }

    if (this.detaTipoCargas.length === 0) {
      Swal.fire('Mensaje', 'Debe agregar al menos un tipo de carga', 'warning');
      return;
    }

    if (this.detaProductos.length === 0) {
      Swal.fire('Mensaje', 'Debe agregar al menos un producto', 'warning');
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
        this.ruta.ID_USUARIO = this._userService.user.ID_USER;
        this.registrando = true;
        this._registerService.updateRuta(this.ruta).subscribe(
          (response: any) => {
            console.log(response);
            this.registrando = false;
          },
          (error: any) => {
            this.registrando = false;
          }
        );
      } 
    });
  }

  async deleteRuta() {
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
        this.ruta.ID_USUARIO = this._userService.user.ID_USER;
        this.registrando = true;
        this._registerService.deleteRuta(this.ruta).subscribe(
          (response: any) => {
            console.log(response);
            this.registrando = false;
            this._router.navigate(['/rutas']);
          },
          (error: any) => {
            this.registrando = false;
          }
        );
      } 
    });
  }

  async aprobarRuta() {
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
      title: 'Aprobar Registro',
      text: "¿Desea aprobar este registro? No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.ruta.ID_USUARIO = this._userService.user.ID_USER;
        this.registrando = true;
        this._registerService.aprobarRuta(this.ruta).subscribe(
          (response: any) => {
            console.log(response);
            this.registrando = false;
            this.getRuta()
            // this._router.navigate(['/rutas']);
          },
          (error: any) => {
            this.registrando = false;
          }
        );
      } 
    });
  }

  async agregarTipoCarga(idTipoCarga) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (this.ruta.ID_TIPO_CARGA == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un tipo de carga.', 'warning');
      return;
    }

    const detaCarga = this.detaTipoCargas.find( deta => deta.idTipoCarga == idTipoCarga);
    if (detaCarga) {
      Swal.fire('Mensaje', 'El tipo de carga ya esta agregado a la lista.', 'warning');
      return;
    }

    var dsTipocarga = ''
    const carga = this.tipoCargas.find( tipoCarga => tipoCarga.ID_TIPO_CARGA == idTipoCarga);
    if (carga) {
      dsTipocarga = carga.DS_TIPO_CARGA
    }

    if (this.ruta.ID_RUTA > 0) {
      this._registerService.registerDetaRutaTipoCarga(idTipoCarga, this.ruta.ID_RUTA).subscribe(
        (response: any) => {
          this.detaTipoCargas.push({
            ID_TIPO_CARGA: idTipoCarga,
            DS_TIPO_CARGA: dsTipocarga,
            ID_DETA_RUTA_TIPO_CARGA: 0
          });
          this.ruta.ID_TIPO_CARGA = 0; 
        }
      );
    } else {
      this.detaTipoCargas.push({
        ID_TIPO_CARGA: idTipoCarga,
        DS_TIPO_CARGA: dsTipocarga,
        ID_DETA_RUTA_TIPO_CARGA: 0
      });
      this.ruta.ID_TIPO_CARGA = 0;    
    }

  }

  async eliminarTipoCarga(i, idDeta) {
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
          this._registerService.deleteDetaRutaTipoCarga(idDeta).subscribe(
            (response: any) => {
              this.detaTipoCargas.splice(i, 1);
            }
          );
        } else {
          this.detaTipoCargas.splice(i, 1);
        }
      } 
    });
  }

  async agregarProducto(idProducto) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (this.ruta.ID_PRODUCTO == 0) {
      Swal.fire('Mensaje', 'Debe seleccionar un producto.', 'warning');
      return;
    }

    const detProducto = this.detaProductos.find( deta => deta.idProducto == idProducto);
    if (detProducto) {
      Swal.fire('Mensaje', 'El producto ya esta agregado a la lista.', 'warning');
      return;
    }

    var dsProducto = ''
    const producto = this.productos.find( producto => producto.ID_PRODUCTO == idProducto);
    if (producto) {
      dsProducto = producto.DS_PRODUCTO
    }

    if (this.ruta.ID_RUTA > 0) {
      this._registerService.registerDetaProducto(idProducto, this.ruta.ID_RUTA).subscribe(
        (response: any) => {
          this.detaProductos.push({
            ID_PRODUCTO: idProducto,
            DS_PRODUCTO: dsProducto,
            ID_DETA_RUTA_PRODUCTO: 0
          });
          console.log(this.detaProductos);
          this.ruta.ID_PRODUCTO = 0; 
        }
      );
    } else {
      this.detaProductos.push({
        ID_PRODUCTO: idProducto,
        DS_PRODUCTO: dsProducto,
        ID_DETA_RUTA_PRODUCTO: 0
      });
      console.log(this.detaProductos);
      this.ruta.ID_PRODUCTO = 0; 
    }
  }

  async eliminarProducto(i, idDeta) {
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
          this._registerService.deleteDetaRutaProducto(idDeta).subscribe(
            (response: any) => {
              this.detaProductos.splice(i, 1);
            }
          );
        } else {
          this.detaProductos.splice(i, 1);
        }
      } 
    });
  }

}
