import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import { API_KEY_QWANTEC, URL_SERVICES } from '../../config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-integracion-qwantec',
  templateUrl: './integracion-qwantec.component.html',
  styles: [
  ]
})
export class IntegracionQwantecComponent implements OnInit {
  apiKeyQwantec: string = API_KEY_QWANTEC;
  desde = '';
  hasta = '';
  idTipoAccion = 0;
  empleados= [];
  loading = false;
  date = new Date();
  mes;
  dia;

  constructor(
    private _registerService: RegisterService,
    public _router: Router,
    private _userService: UserService
  ) { 
    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.desde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.hasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  ngOnInit(): void {
  }

  tipoAccion(valor) {
    this.idTipoAccion = valor;
  }

  registroActEmpleados(desde, hasta) {
    this.loading = true;
    this._registerService.getEmpleadosRhhGenesys(desde, hasta).subscribe(
      (response: any) => {
        this.empleados = response.empleados;
        let empleadosNuevos = [];
        this.empleados.forEach((empleado) => {          
          empleadosNuevos.push({
            codigo: empleado.codigo,
            rut: empleado.rut,
            codigoFicha: empleado.codigoFicha,
            nombres: empleado.nombres,   
            apellidos: empleado.apellidos,
            nombreEnReloj: empleado.nombreEnReloj,
            email: empleado.email,
            fechaNacimiento: empleado.fechaNacimiento,
            nacionalidad: empleado.nacionalidad,
            genero: empleado.genero,
            cargo: empleado.cargo,
            comentario: empleado.comentario,
            fechaContrato: empleado.fechaContrato,
            fechaFinContrato: empleado.fechaFinContrato,
            direccion1: empleado.direccion1,
            direccion2: empleado.direccion2,
            ciudad: empleado.ciudad,
            telefonoFijo: empleado.telefonoFijo,
            telefonoMovil: empleado.telefonoMovil,
            sucursal: empleado.sucursal,
            departamento: empleado.departamento,                                                        
            aliasCompania: empleado.aliasCompania,
            estado: true 
          });
        });
        // console.log('empleadosNuevos:', empleadosNuevos);
        let data;
        let crearNoExistentes;
        if (this.idTipoAccion === 1) {
          crearNoExistentes = true;
        }

        if (this.idTipoAccion === 2) {
          crearNoExistentes = false;
        }

        data = {
          "apiKey": this.apiKeyQwantec,
          "empleados": empleadosNuevos,
          "crearNoExistentes": crearNoExistentes
        }
        console.log('data:', data);
        this.loading = false;
        return;
        data = {
          "apiKey": this.apiKeyQwantec,
          "empleados": [
            {
              "codigo": "17026508",
              "rut": "17026508",
              "codigoFicha": "17026508",
              "nombres": "Prueba2 Nombre2",   
              "apellidos": "Prueba2 Apellido2",
              "nombreEnReloj": "papellido2",
              "email": "devbriane2@gmail.com",
              "fechaNacimiento": "1986-12-12",
              "nacionalidad": null,
              "genero": 1,
              "cargo": "Programador",
              "comentario": null,
              "fechaContrato": "2020-05-04",
              "fechaFinContrato": null,
              "direccion1": "CALLAO, CALLAO, CALLAO",
              "direccion2": "201",
              "ciudad": "LIMA",
              "telefonoFijo": null,
              "telefonoMovil": "929647791",
              "sucursal": "Matriz",
              "departamento": "Departamento inicial",                                                        
              "aliasCompania": null,
              "estado": true
            },
            {
              "codigo": "178232817",
              "rut": "178232817",
              "codigoFicha": "178232817",
              "nombres": "Prueba1 Nombre1",   
              "apellidos": "Prueba1 1",
              "nombreEnReloj": "papellido1",
              "email": "devbriane@gmail.com",
              "fechaNacimiento": "1986-12-12",
              "nacionalidad": null,
              "genero": 1,
              "cargo": "Programador",
              "comentario": null,
              "fechaContrato": "2020-05-04",
              "fechaFinContrato": null,
              "direccion1": "CALLAO, CALLAO, CALLAO",
              "direccion2": "201",
              "ciudad": "LIMA",
              "telefonoFijo": null,
              "telefonoMovil": "929647791",
              "sucursal": "Matriz",
              "departamento": "Departamento inicial",                                                        
              "aliasCompania": null,
              "estado": true
            },
            {
              "codigo": "108239214",
              "rut": "003075753",
              "codigoFicha": "003075753",
              "nombres": "Luis Raul",   
              "apellidos": "Galicia Lugo",
              "nombreEnReloj": "lgalicia",
              "email": "luis.galicia@supervan.pe",
              "fechaNacimiento": "1986-12-12",
              "nacionalidad": null,
              "genero": 1,
              "cargo": "Analista Programador",
              "comentario": null,
              "fechaContrato": "2020-05-04",
              "fechaFinContrato": null,
              "direccion1": "CALLAO, CALLAO, CALLAO",
              "direccion2": "201",
              "ciudad": "LIMA",
              "telefonoFijo": null,
              "telefonoMovil": "929647791",
              "sucursal": "Matriz",
              "departamento": "Departamento inicial",                                                        
              "aliasCompania": null,
              "estado": true
            }
          ],
          "crearNoExistentes": false
        }
        this._registerService.sincronizarEmpleadosQwantec(data).subscribe(
          (response: any) => {
            console.log('response API:', response);

            let empleadosRegistrados = 0;
            let empleadosActualizados = 0;

            response.empleadosOK.forEach((empleado) => {
              if (empleado.codigoImportacion === 0 || empleado.codigoImportacion === 1) {
                empleadosActualizados ++;
              }

              if (empleado.codigoImportacion === 11 || empleado.codigoImportacion === 12) {
                empleadosRegistrados ++;
              }
            });


            if (this.idTipoAccion === 1) {
              Swal.fire('Mensaje', 'Cantidad de empleados registrados: ' + empleadosRegistrados, 'success');
            }
            if (this.idTipoAccion === 2) {
              Swal.fire('Mensaje', 'Cantidad de empleados actualizados: ' + empleadosActualizados, 'success');
            }
            this.loading = false;
            this.limpiarModal();
          },
          (error: any) => {
            this.loading = false;
            this.limpiarModal();
          }
        );
      },
      (error: any) => {
        this.loading = false;
        this.limpiarModal();
      }
    );
  }

  bajaEmpleados(desde, hasta) {
    this.loading = true;
    this._registerService.getEmpleadosRhhGenesysBajas(desde, hasta).subscribe(
      (response: any) => {
        console.log(response);
        this.empleados = response.empleados;
        let empleadosNuevos = [];
        this.empleados.forEach((empleado) => {          
          empleadosNuevos.push({
            codigo: empleado.codigo,
            rut: empleado.rut,
            codigoFicha: empleado.codigoFicha,
            nombres: empleado.nombres,   
            apellidos: empleado.apellidos,
            nombreEnReloj: empleado.nombreEnReloj,
            email: empleado.email,
            fechaNacimiento: empleado.fechaNacimiento,
            nacionalidad: empleado.nacionalidad,
            genero: empleado.genero,
            cargo: empleado.cargo,
            comentario: empleado.comentario,
            fechaContrato: empleado.fechaContrato,
            fechaFinContrato: empleado.fechaFinContrato,
            direccion1: empleado.direccion1,
            direccion2: empleado.direccion2,
            ciudad: empleado.ciudad,
            telefonoFijo: empleado.telefonoFijo,
            telefonoMovil: empleado.telefonoMovil,
            sucursal: empleado.sucursal,
            departamento: empleado.departamento,                                                        
            aliasCompania: empleado.aliasCompania,
            estado: false 
          });
        });
        let data;
        data = {
          "apiKey": this.apiKeyQwantec,
          "empleados": empleadosNuevos,
          "crearNoExistentes": false
        }
        // console.log('data:', data);
        // this.loading = false;
        // return;
        // data = {
        //   "apiKey": this.apiKeyQwantec,
        //   "empleados": [
        //       {
        //           "codigo": "17026508",
        //           "rut": "17026508",
        //           "codigoFicha": "17026508",
        //           "nombres": "Prueba Nombre",   
        //           "apellidos": "Prueba2 Apellido2",
        //           "nombreEnReloj": "papellido2",
        //           "email": "devbriane2@gmail.com",
        //           "fechaNacimiento": "1986-12-12",
        //           "nacionalidad": null,
        //           "genero": 1,
        //           "cargo": "Programador",
        //           "comentario": null,
        //           "fechaContrato": "2020-05-04",
        //           "fechaFinContrato": null,
        //           "direccion1": "CALLAO, CALLAO, CALLAO",
        //           "direccion2": "201",
        //           "ciudad": "LIMA",
        //           "telefonoFijo": null,
        //           "telefonoMovil": "929647791",
        //           "sucursal": "Matriz",
        //           "departamento": "Departamento inicial",                                                        
        //           "aliasCompania": null,
        //           "estado": false
        //       },
        //       {
        //         "codigo": "178232817",
        //         "rut": "178232817",
        //         "codigoFicha": "178232817",
        //         "nombres": "Prueba Nombre",   
        //         "apellidos": "Prueba2 Apellido2",
        //         "nombreEnReloj": "papellido2",
        //         "email": "devbriane@gmail.com",
        //         "fechaNacimiento": "1986-12-12",
        //         "nacionalidad": null,
        //         "genero": 1,
        //         "cargo": "Programador",
        //         "comentario": null,
        //         "fechaContrato": "2020-05-04",
        //         "fechaFinContrato": null,
        //         "direccion1": "CALLAO, CALLAO, CALLAO",
        //         "direccion2": "201",
        //         "ciudad": "LIMA",
        //         "telefonoFijo": null,
        //         "telefonoMovil": "929647791",
        //         "sucursal": "Matriz",
        //         "departamento": "Departamento inicial",                                                        
        //         "aliasCompania": null,
        //         "estado": false
        //     },
        //     {
        //       "codigo": "108239214",
        //       "rut": "003075753",
        //       "codigoFicha": "003075753",
        //       "nombres": "Luis Raul",   
        //       "apellidos": "Galicia Lugo",
        //       "nombreEnReloj": "lgalicia",
        //       "email": "luis.galicia@supervan.pe",
        //       "fechaNacimiento": "1986-12-12",
        //       "nacionalidad": null,
        //       "genero": 1,
        //       "cargo": "Analista Programador",
        //       "comentario": null,
        //       "fechaContrato": "2020-05-04",
        //       "fechaFinContrato": null,
        //       "direccion1": "CALLAO, CALLAO, CALLAO",
        //       "direccion2": "201",
        //       "ciudad": "LIMA",
        //       "telefonoFijo": null,
        //       "telefonoMovil": "929647791",
        //       "sucursal": "Matriz",
        //       "departamento": "Departamento inicial",                                                        
        //       "aliasCompania": null,
        //       "estado": true
        //     }
        //   ],
        //   "crearNoExistentes": false
        // }
        this._registerService.sincronizarEmpleadosQwantec(data).subscribe(
          (response: any) => {
            console.log('response API:', response);
            Swal.fire('Mensaje', 'Cantidad de empleados dados de baja: ' + response.empleadosOK.length, 'success');
            this.loading = false;
            this.limpiarModal();
          },
          (error: any) => {
            this.loading = false;
            this.limpiarModal();
          }
        );
      },
      (error: any) => {
        this.loading = false;
        this.limpiarModal();
      }
    );
  }

  // marcajesQwantec() {
  //   console.log('inicio consulta');
  //   var inicio = '2020-11-16T00:00:00';
  //   var termina = '2020-11-17T23:59:59'
  //   var indentificador = ["108239214"];    
  //   let data = {
  //     apiKey: this.apiKeyQwantec,
  //     inicio: inicio,
  //     termino: termina,
  //     identificador: indentificador
  //   }; 
  //   this._registerService.marcajesQwantec(data).subscribe(
  //     (response: any) => {
  //       console.log('response:', response);
  //       console.log('termino consulta');
  //     }
  //   );
  // }

  limpiarModal() {
    this.desde = '';
    this.hasta = '';
    this.idTipoAccion = 0;
  }

}
