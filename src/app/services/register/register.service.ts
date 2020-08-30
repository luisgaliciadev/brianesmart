import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';

// Others
import Swal from 'sweetalert2';
import { Client } from '../../models/client';
import { UserService } from '../user/user.service';
import { AddressClient } from '../../models/addressClient.model';
import { Denuncia } from 'src/app/models/denuncia.model';
import { UploadFileService } from '../uploadFile/upload-file.service';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public URL: string;

  constructor(
    public _userService: UserService,
    public _http: HttpClient,
    public _router: Router,
    public _uploadFileService: UploadFileService
  ) {
    this.URL = URL_SERVICES;
  }

//////////////////////////////////////////////////////////////////////////////////////////////////
// METODO PARA CLIENTES

// Get Type Id Client
getIdTypeClient() {
  return this._http.get(this.URL + '/register/idtypeclient')
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get Type Id Client

// Get Type Client
getTypeClient() {
  return this._http.get(this.URL + '/register/typeclient')
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get Type Client

// Register Client
registerClient(client: Client) {
  // tslint:disable-next-line: prefer-const
  let json = JSON.stringify(client);
   // tslint:disable-next-line: prefer-const
  let params = json;
   // tslint:disable-next-line: prefer-const
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/client', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Cliente Registrado Correctamente.', 'success');
    return res.client;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registrar el cliente.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Client

// Update Client
updateClient(client: Client) {
  // tslint:disable-next-line: prefer-const
  let json = JSON.stringify(client);
   // tslint:disable-next-line: prefer-const
  let params = json;
   // tslint:disable-next-line: prefer-const
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/client', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Cliente Actualizado Correctamente.', 'success');
    return res.client;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo Actualizar el cliente.', 'error');
      return throwError(err);
    }
  }));
}
// End Update Client

// Delete Client
deleteClient(id) {
  return this._http.delete(this.URL + '/register/client/' + id)
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Cliente Eliminado Correctamente.', 'success');
    return true;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se Pudo eliminar el cliente.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Client

// Get Clients
getClients(search) {
  if (search === '') {
    search = '0';
  }
  return this._http.get(this.URL + '/register/clients/' + search + '/' + this._userService.user.ID_USER)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }));
}
// End Get Clients

// // Get Clients
// async getClientsReport(search) {
//   if (search === '') {
//     search = '0';
//   }
//   //return
//   const report = await this._http.get(this.URL + '/register/clients/' + search + '/' + this._userService.user.ID_USER)
//   report.pipe(map((res: any) => {
//      console.log('res.clients:', res.clients);
//      return res.clients;
//   }));
//   // console.log('report:', report)
//   // return report;
//   // const clientes = await report.pipe(map((res: any) => {
//   //   // console.log(res);
//   //   return clientes;
//   // }));
// }
// // End Get Clients

// Get Client
getClient(idClient) {
  return this._http.get(this.URL + '/register/client/' + idClient + '/' + this._userService.user.ID_USER)
  .pipe(map((res: any) => {
      return res.client;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      this._router.navigate(['/clients']);
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el cliente', 'error');
      this._router.navigate(['/clients']);
      return throwError(err);
    }
  }));
}
// End Get Client

 // Register Address Client
 registerAddress(addressClient: AddressClient, principal: boolean) {

  // tslint:disable-next-line: prefer-const
  let json = JSON.stringify(addressClient);
   // tslint:disable-next-line: prefer-const
  let params = json;
  // console.log('parametros:' + params);
   // tslint:disable-next-line: prefer-const
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/address', params, {headers})
  .pipe(map((res: any) => {
    // console.log(res);
    if (!principal) {
      Swal.fire('Mensaje', 'Sucursal registrada correctamente.', 'success');
    }
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registrar la sucursal.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Address Client

 // Update Address Client
 UpdateAddress(addressClient: AddressClient, idAddress: number) {
  // tslint:disable-next-line: prefer-const
  let json = JSON.stringify(addressClient);
   // tslint:disable-next-line: prefer-const
  let params = json;
   // tslint:disable-next-line: prefer-const
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/addressupdate/' + idAddress, params, {headers})
  .pipe(map((res: any) => {
    // console.log(res);
    Swal.fire('Mensaje', 'Sucursal Actualizada correctamente.', 'success');
    return res.address;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo actualizar la sucursal.', 'error');
      return throwError(err);
    }
  }));
}
// End Update Address Client

// Get address Client
getAddressClient(idAddress: number, idUser) {
  return this._http.get(this.URL + '/register/address/' + idAddress + '/' + idUser)
  .pipe(map((res: any) => {
    if (res.address) {
      return res.address;
    } else {
      Swal.fire('Mensaje', 'Sucursal no Registrada.', 'warning');
      return 0;
    }
  }));
}
// End address Client

// Gets Address Client
getAddressClients(idClient) {
  return this._http.get(this.URL + '/register/address/' + idClient)
  .pipe(map((res: any) => {
    return res.address;
  }));
}
// End Get Address Clients

// Establecer direccion principal de cliente
defaultAddressClient(addressClient: AddressClient, idAddress: number) {

  // tslint:disable-next-line: prefer-const
  let json = JSON.stringify(addressClient);
   // tslint:disable-next-line: prefer-const
  let params = json;

  // tslint:disable-next-line: prefer-const
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/defaultaddress/' + idAddress, params, {headers})
  .pipe(map((res: any) => {
    // console.log(res);
    Swal.fire('Mensaje', 'Sucursal principal establecida correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo actualizar la sucursal.', 'error');
      return throwError(err);
  }));
}
// Fin de Establecer direccion principal de empresa

// Delete Address Client
deleteAddressClient(id: number) {
  // tslint:disable-next-line: prefer-const
 let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
 return this._http.delete(this.URL + '/register/address/' + id, {headers})
 .pipe(map((res: any) => {
  //  console.log(res);
   Swal.fire('Mensaje', 'Sucursal Eliminada Correctamente.', 'success');
   return true;
 }))
 .pipe(catchError( (err: any) => {
  if (err.status === 400) {
    Swal.fire('Mensaje', err.error.message, 'error');
    return throwError(err);
  } else {
    Swal.fire('Mensaje', 'No se pudo Eliminar la sucursal.', 'error');
    return throwError(err);
  }
}));
}
// End Delete Address Client

// METODO PARA CLIENTES
//////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////
// DENUNCIAS

 // Register Denuncias
 registerDenuncia(denuncia: Denuncia) {
  let params = denuncia;
  return this._http.post(this.URL + '/register/denuncia', params)
    .pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Denuncia registrada correctamente', 'success');
      return res;
    }))
    .pipe(catchError( (err: any) => {
      if (err.status === 400) {
        Swal.fire('Mensaje', err.error.message, 'error');
      } else {
        Swal.fire('Mensaje', 'No se pudo realizar el registro', 'error');
        return throwError(err);
      }
    }));
 }
// End Register Denuncias

// Get denuncias
getDenuncias(search) {
  if (search === '') {
    search = '0';
  }
  return this._http.get(this.URL + '/register/denuncias/' + search)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }));
}
// End Get denuncias

// Get denuncias
getDenuncia(idDenuncia) {
  return this._http.get(this.URL + '/register/verdenuncia/' + idDenuncia)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      this._router.navigate(['/denuncias']);
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el usuario.', 'error');
      this._router.navigate(['/denuncias']);
      return throwError(err);
    }
  }));
}
// End Get denuncias

// Delete Denuncia
deleteDenuncia(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/denuncia/' + id, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Denuncia Eliminada Correctamente.', 'success');
    return true;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se Pudo eliminar la denuncia.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Denuncia

// Metodo para exportar a excel listado de denuncias
getDenunciasExcel(search) {
  if (search === '') {
    search = '0';
  }    
  return this._http.get(this.URL + '/excel/denuncias/' + search, {responseType: 'blob'})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar empresas

 // Cambiar imagen de empresa
 uploadFileDenuncia(file: File, id: number, numArchivo: number) {
  // console.log('ID_USER:'+ this.user.ID_USER);
  // console.log('file:', file);
  // console.log('id:', id);
  // return;
  this._uploadFileService.uploadFile(file, 'denuncia', id, numArchivo)
      .then( (resp: any) => {
        // Swal.fire('Mensaje', 'Imagen Actualizada Correctamente', 'success');
      })
      .catch( resp => {
        // Swal.fire('Error', 'No se pudo subir la imagen', 'warning');
      });
 }
// Fin Cambiar imagen de empresa

// Metodo para exportar a excel listado de denuncias
// getDenuncia(idDenuncia) {

//   return this._http.get(this.URL + '/register/verdenuncia/' + idDenuncia)
//   .pipe(map((res: any) => {
//     // console.log(res);
//     return res;
//   }))
//   .pipe(catchError( (err: any) => {
//     if (err.status === 400) {
//       Swal.fire('Mensaje', err.error.message, 'error');
//       this._router.navigate(['/denuncias']);
//       return throwError(err);
//     } else {
//       Swal.fire('Mensaje', 'No se pudo consultar el usuario.', 'error');
//       this._router.navigate(['/denuncias']);
//       return throwError(err);
//     }
//   }));
// }
// End Get denuncias
// Fin Metodo para exportar empresas

// DENUNCIAS
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// CONDUCTOR

// Get zonas conductor
getZonaConductor() {
  return this._http.get(this.URL + '/conductor/zonas')
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }))
}
// End Get zonas conductor

// Get  conductor
getConductor(idConductor) {
  return this._http.get(this.URL + '/conductor/' + idConductor)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el conductor.', 'error');
      return throwError(err);
    }
  }));
}
// End Get conductor

// Get datos semana
getDatoSemana(dia) {
  return this._http.get(this.URL + '/conductor/datosemana/' + dia)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }));
}
// End Get datos semana

// Get dias semana
getDiasSemana(desde, hasta) {
  return this._http.get(this.URL + '/conductor/diasemana/' + desde + '/' + hasta)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }));
}
// End Get datos semana


// Get tarifas viaticos
getTarifasViatico(idZona) {
  return this._http.get(this.URL + '/conductor/tarifasviatico/' + idZona)
  .pipe(map((res: any) => {
    // console.log(res);
    return res;
  }));
}
// End Get datos semana

// Register Viatico
registerViatico(viaticos, semana, year, zona, montoTotal) { 
  let json = JSON.stringify(viaticos);  
  let detaViaticos = json;  
  let params = semana + '/' + year + '/' + zona + '/' + montoTotal + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/viatico/' + params , detaViaticos, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Viaticos Registrado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Viatico

// Register Viatico
updateViatico(viaticos, semana, year, zona, montoTotal, id, nroDia) { 
  let json = JSON.stringify(viaticos);  
  let detaViaticos = json;  
  let params = semana + '/' + year + '/' + zona + '/' + montoTotal  + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/conductor/viatico/' + params , detaViaticos, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Viaticos Registrado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo actualizar la información.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Viatico

// Get Viaticos
getViaticos(desde, hasta, search) { 
  if (search === '') {
    search = '0'
  } 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/viaticos/' + desde + '/' + hasta + '/' + search, {headers})
  .pipe(map((res: any) => {
    // console.log(res); 
    return res;   
  }))
}
// End Get Viaticos

// Get Viatico
getViatico(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/viatico/' + id, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    this._router.navigate(['/viaticos']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Viatico

// Get deta viaticos
getDetaViaticos(semana, year, id, idConductor) {
  let params = semana + '/' + year + '/' + id + '/' + idConductor;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/detaviaticos/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {  
    this._router.navigate(['/viaticos']); 
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get deta viticos

// Delete viaticos
deleteViaticos(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/conductor/viatico/' + id + '/' + this._userService.user.ID_USER, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Viaticos Anulados Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo anular el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Viaticos

// Aprobar viaticos
aprobarViaticos(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/conductor/aprobarviatico/' + id + '/' + this._userService.user.ID_USER,{}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Viaticos Aprobados Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo aprobar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Aprobar viaticos

// Generar comprobantes viticos
generarComprobantes(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/pdf/movilidadcond/' + id + '/' + this._userService.user.ID_USER, {}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', res.message, 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    this._router.navigate(['/viaticos']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo generar los comprobantes.', 'error');
      return throwError(err);
    }
  }));
}
// End Generar comprobantes viticos

// Get reporte productividad conductor
getRepProductividadCond(semana, year, zona) {
  // let params = tipo + '/' + semana + '/' + year + '/' + desde + '/' + hasta;
  let params = semana + '/' + year + '/' + zona;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/productividad/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Get reporte productividad conductor

// Get Viajes/horas
getViajesHoras(search,desde, hasta, dni, zona) {
  let params = desde + '/' + hasta + '/' + dni + '/' + search + '/' + zona;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/viajeshoras/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el listado de viajes.', 'error');
    return throwError(err);
  }));
}
// End Get Guias

// Get resumen viaticos
getResumenViaticos(idViatico) {
  let params = idViatico;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/resumenviaticos/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el resumen de viáticos.', 'error');
    return throwError(err);
  }));
}
// End Get resumen viticos

// let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
// return this._http.post(this.URL + '/conductor/viatico/' + params , detaViaticos, {headers})

// FIN CONDUCTOR
////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////
// OPERACIONES

// Get Orden servicio
getOrdenServicio(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/os/' + id, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar las ordenes de servicio.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Orden servicio

// Get Orden servicio all
getOrdenServicioAll(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/osall/' + id, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar las ordenes de servicio.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Orden servicio

// Get Vehiculo
getVehiculo(placa, tipo) {
  
  return this._http.get(this.URL + '/operaciones/vehiculo/' + placa + '/' + tipo)
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el vehiculo.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Vehiculo

// Register Guia
registerGuia(guia) { 
  let json = JSON.stringify(guia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/operaciones/guia', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Guia Registrada Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registar la guia.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Guia

// Get Guia
getGuia(id, idUser) {
  // console.log('id:',id),
  // console.log('idUser:',idUser)
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/guia/' + id + '/' + idUser, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      this._router.navigate(['/guias']);
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la guia.', 'error');
      this._router.navigate(['/guias']);
      return throwError(err);
    }
  }));
}
// End Get Guia

// Update Guia
updateGuia(guia) { 
  let json = JSON.stringify(guia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/guia', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Guia Actualizada Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registar la guia.', 'error');
      return throwError(err);
    }
  }));
}
// End Update Guia

// Get Guias
getGuias(search,desde, hasta) {
  let params = this._userService.user.ID_USER + '/' + search + '/' + desde + '/' + hasta;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/guias/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el listado de guias.', 'error');
    return throwError(err);
  }));
}
// End Get Guias

// Delete Guia
deleteGuia(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/operaciones/guia/' + id, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Guia anulada correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la guia.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Guia

// Metodo para exportar a excel listado de guias
getGuiasExcel(search,desde, hasta) {
  if (search === '') {
    search = '0';
  }    
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = this._userService.user.ID_USER + '/' + search + '/' + desde + '/' + hasta;
  return this._http.get(this.URL + '/excel/guias/' + params, {responseType: 'blob'})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar empresas

// Get productividad OP
getProductividadop(tipo,semana, year, desde, hasta,zona) {
  // let params = tipo + '/' + semana + '/' + year + '/' + desde + '/' + hasta;
  let params = semana + '/' + year + '/' + zona;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/diasproductividadop/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Get productividad OP

// Get years
getYears() {
  return this._http.get(this.URL + '/operaciones/years')
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'Error en la petición.', 'error');
    return throwError(err);
  }));
}
// End Get years

// Get motivo no op
getMotivoNoOp() {
  return this._http.get(this.URL + '/operaciones/motivonoop')
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el listado de motivos.', 'error');
    return throwError(err);
  }));
}
// End Get motivo no op

// Register Report OP
registerReportPro(diasproductividadop, nroSemana, anio, zona) { 
  let json = JSON.stringify(diasproductividadop);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = nroSemana + '/' + anio + '/' + zona + '/' + this._userService.user.ID_USER
  // console.log(parametros);
  return this._http.post(this.URL + '/operaciones/reportop/' + parametros, params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro realizado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Report OP

// Register Report OP nuevos viajes
registerReportProNuevos(diasproductividadop, nroSemana, anio, zona, idReport) { 
  let json = JSON.stringify(diasproductividadop);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = nroSemana + '/' + anio + '/' + zona + '/' + this._userService.user.ID_USER + '/' + idReport;
  // console.log(parametros);
  return this._http.post(this.URL + '/operaciones/reportopviajes/' + parametros, params, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Viajes Actualizados Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Report OP nuevos viajes

// Update deta Report OP
updateReportPro(diasproductividadop, nroSemana, anio, zona, id, nroDia) { 
  let json = JSON.stringify(diasproductividadop);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/operaciones/reportop/' + parametros, params, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Registro realizado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo actualizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Update deta Report OP

// Delete deta Report OP
updateDetaReportPro(diasproductividadop, nroSemana, anio, zona, id, nroDia) { 
  let json = JSON.stringify(diasproductividadop);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/operaciones/detareportop/' + parametros, params, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Registro realizado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo anular el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete deta Report OP


// Update Report OP viajes nuevos
updateReportProNuevo(diasproductividadop, nroSemana, anio, zona, id) { 
  let json = JSON.stringify(diasproductividadop);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/operaciones/reportopdeta/' + parametros, params, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Registro realizado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo actualizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Update OP

// Aprobar Reporte productividad
aprobarReportePro(id, idZona) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/aprobarrepportop/' + id + '/' + this._userService.user.ID_USER + '/' + idZona,{}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Reporte Aprobado Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo aprobar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Aprobar Reporte productividad

// Delete Report OP
deleteReportOP(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/operaciones/reportop/' + id + '/' + this._userService.user.ID_USER, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Reporte Anulado Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo anular el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Report OP

// Get deta report productividad
getDetaReportPro(semana, year, id) {
  let params = semana + '/' + year + '/' + id;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/detareportprodop/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {  
    this._router.navigate(['/reportsprodop']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get deta viticos

// Get reportes productividad
getReportsPro(desde, hasta, search) { 
  if (search === '') {
    search = '0'
  } 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/reportspro/' + desde + '/' + hasta + '/' + search, {headers})
  .pipe(map((res: any) => {
    // console.log(res); 
    return res;   
  }))
}
// End Get reportes productividad

// Get reporte op
getReportPro(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/reportprodop/' + id, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    this._router.navigate(['/reportsprodop']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
      return throwError(err);
    }
  }));
}
// End Get reporte op
 

// OPERACIONES
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// Administracion

// Get cliente
getCliente(ruc) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/cliente/' + ruc, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el cliente.', 'error');
      return throwError(err);
    }
  }));
}
// End Get cliente

// Get dias feriados
getDiasFeriados() {
  return this._http.get(this.URL + '/register/diasferiado')
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la informacion', 'error');
    return throwError(err);
  }));
}
// End Get dias feriados

// Administracion
/////////////////////////////////////////////////////////////////////////////////////////////////
}
