import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { API_KEY_QWANTEC, URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

// Others
import Swal from 'sweetalert2';
import { Client } from '../../models/client';
import { UserService } from '../user/user.service';
import { AddressClient } from '../../models/addressClient.model';
import { Denuncia } from 'src/app/models/denuncia.model';
import { UploadFileService } from '../uploadFile/upload-file.service';
import { ParseTreeResult } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public URL: string;
  public apiKeyQwantec: string;

  constructor(
    public _userService: UserService,
    public _http: HttpClient,
    public _router: Router,
    public _uploadFileService: UploadFileService
  ) {
    this.URL = URL_SERVICES;
    this.apiKeyQwantec = API_KEY_QWANTEC;
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
  let json = JSON.stringify(client);  
  let params = json;  
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
  let json = JSON.stringify(client);  
  let params = json;  
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
  let json = JSON.stringify(addressClient);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/address', params, {headers})
  .pipe(map((res: any) => {
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
  let json = JSON.stringify(addressClient);
  let params = json;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/addressupdate/' + idAddress, params, {headers})
  .pipe(map((res: any) => {
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
  let json = JSON.stringify(addressClient);
  let params = json;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/defaultaddress/' + idAddress, params, {headers})
  .pipe(map((res: any) => {
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
 let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
 return this._http.delete(this.URL + '/register/address/' + id, {headers})
 .pipe(map((res: any) => {
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
    return res;
  }));
}
// End Get denuncias

// Get denuncias
getDenuncia(idDenuncia) {
  return this._http.get(this.URL + '/register/verdenuncia/' + idDenuncia)
  .pipe(map((res: any) => {
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

 // Subir archivo de denuncia
 uploadFileDenuncia(file: File, id: number, numArchivo: number) {
  this._uploadFileService.uploadFile(file, 'denuncia', id, numArchivo)
      .then( (resp: any) => {
        // Swal.fire('Mensaje', 'Imagen Actualizada Correctamente', 'success');
      })
      .catch( resp => {
        // Swal.fire('Error', 'No se pudo subir la imagen', 'warning');
      });
 }
// Fin Subir archivo de denuncia

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
    return res;
  }))
}
// End Get zonas conductor

// Get  conductor
getConductor(idConductor) {
  return this._http.get(this.URL + '/conductor/' + idConductor)
  .pipe(map((res: any) => {
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
    return res;
  }));
}
// End Get datos semana

// Get dias semana
getDiasSemana(desde, hasta) {
  return this._http.get(this.URL + '/conductor/diasemana/' + desde + '/' + hasta)
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get datos semana

// Get tarifas viaticos
getTarifasViatico(idZona) {
  return this._http.get(this.URL + '/conductor/tarifasviatico/' + idZona)
  .pipe(map((res: any) => {
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
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      this._router.navigate(['/viaticos']);
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo generar los comprobantes.', 'error');
      this._router.navigate(['/viaticos']);
      return throwError(err);
    }
  }));
}
// End Generar comprobantes viticos

// Generar detalle comprobantes viticos por conductor
generarComprobanteConductor(idViatico, idConductor) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/pdf/pdfdetaviatico/' + idViatico + '/' + idConductor, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', res.message, 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/viaticos']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo generar el comprobante.', 'error');
      return throwError(err);
    }
  }));
}
// End Generar comprobantes viticos

// Generar nuevo comprobante viticos por conductor
generarNuevoComprobanteConductor(idViatico, idConductor) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/pdf/renewpdfviatico/' + idViatico + '/' + idConductor, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', res.message, 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/viaticos']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo generar el comprobante.', 'error');
      return throwError(err);
    }
  }));
}
// End Generar nuevo comprobante viticos por conductor

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
  return this._http.get(this.URL + '/conductor/viajeshorascomision/' + params, {headers})
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

// Get resumen viaticos por conductor
getResumenViaticosPorConductor(idConductor, desde, hasta) {
  let params = idConductor + '/' + desde + '/' + hasta;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/resumenviaticosporconductor/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el resumen de viáticos.', 'error');
    return throwError(err);
  }));
}
// End Get resumen viticos

// Get detalle viaticos por conductor
getDetaViaticoPorConductor(idViatico, idConductor) {
  let params = idViatico + '/' + idConductor;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/detaviaticoporconductor/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el detalle de viáticos.', 'error');
    return throwError(err);
  }));
}
// End Get detalle viticos

// Register Peaje
registerPeaje(peajes) { 
  let json = JSON.stringify(peajes);  
  let DataPeajes = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/peaje', DataPeajes, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Peajes Registrado Correctamente.', 'success');
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
// End Register Peaje

// Register deta Peaje
registerDetaPeaje(peajes) { 
  let json = JSON.stringify(peajes);  
  let DataPeajes = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/detapeaje', DataPeajes, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Peajes Registrado Correctamente.', 'success');
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
// End Register deta Peaje

// Get Peajes
getPeajes(search, desde, hasta) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peajes/' + desde + '/' + hasta + '/' + search, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Peajes

// Get Peajes saldos
getPeajeSaldos(search, desde, hasta) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peajesaldos/' + desde + '/' + hasta + '/' + search, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Peajes saldos

// Get Peajes descuentos
getPeajeDescuentos(search, desde, hasta) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peajesdescuentos/' + desde + '/' + hasta + '/' + search, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Peajes descuentos

// Get Peaje
getPeaje(idPeaje) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peaje/' + idPeaje, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Peaje

// Update Peaje
updatePeaje(peajes) { 
  let json = JSON.stringify(peajes);  
  let DataPeajes = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/conductor/peaje', DataPeajes, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Peajes Actualizado Correctamente.', 'success');
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
// End Update Peaje

// Delete detalle Peaje
deleteDetaPeaje(idPeaje, idDeta) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = idPeaje + '/' + idDeta + '/' + this._userService.user.ID_USER;
  return this._http.delete(this.URL + '/conductor/detapeajes/' + parametros, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se eliminar el registro.', 'error');
      return throwError(err);
    }
  }));
}

// Delete Peaje
deletePeaje(idPeaje) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = idPeaje + '/' + this._userService.user.ID_USER;
  return this._http.delete(this.URL + '/conductor/peaje/' + parametros, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Peajes Anulados Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se eliminar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Peaje

// Register Peaje factura
registePeajeFact(factura) { 
  let json = JSON.stringify(factura);  
  let dataFactura = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/peajefact', dataFactura, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Factura Registrada Correctamente.', 'success');
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
// End Register Peaje factura

// Get Peajes facturas
getPeajeFacturas(idDeta) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peajefact/' + idDeta, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Peajes facturas

// Get verificar guia
getVerificarNroGuia(correlativo, DNI) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/nroguiacond/' + correlativo + '/' + DNI, {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get verificar guia

// Delete Peaje factura
deletePeajeFact(id) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let parametros = id + '/' + this._userService.user.ID_USER;
  return this._http.delete(this.URL + '/conductor/peajefact/' + parametros, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Factura eliminada Correctamente.', 'success');
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo eliminar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Delete Peaje

// Get documentos peajes
getDocPeajes() { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/peajes/documentos', {headers})
  .pipe(map((res: any) => {
    return res;   
  }))
  .pipe(catchError( (err: any) => {   
    // this._router.navigate(['/peajes']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la informacion.', 'error');
      return throwError(err);
    }
  }));
}
// End Get documentos peajes

// Update deta Peaje
updateDetaPeaje(idDeta,valor) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idDeta + '/' + valor + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/conductor/detapeaje/' + params,{}, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Peajes Actualizado Correctamente.', 'success');
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
// End Update deta Peaje

// Update all deta Peaje
updateAllDetaPeaje(idPeaje,valor) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idPeaje + '/' + valor + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/conductor/alldetapeaje/' + params,{}, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Peajes Actualizado Correctamente.', 'success');
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
// End Update deta Peaje

// Get excel deta peaje telecredito
getExcelPeajeTelecredito(idPeaje){
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/excel/detapeajetelecredito/' + idPeaje, {responseType: 'blob' , headers})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// End Get excel deta peaje telecredito

// Procesar Peaje
procesarPeaje(idPeaje) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idPeaje + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/conductor/procesarpeaje/' + params,{}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Solicitud procesada correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo procesar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Procesar Peaje

// Liquidar Peaje
liquidarPeaje(idPeaje) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idPeaje + '/' + this._userService.user.ID_USER;
  return this._http.put(this.URL + '/conductor/liquidarpeaje/' + params,{}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Solicitud liquidada correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo liquidar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Liquidar Peaje

// Metodo para exportar a excel saldo de peajes de conductores
getExcelSaldosPeaje(desde, hasta, search) {
  if (search === '') {
    search = '0';
  }    
  let params = desde + '/' + hasta + '/' + search;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/excel/saldospeaje/' + params, {responseType: 'blob', headers})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar a excel saldo de peajes de conductores

// Notificar saldos peaje
notificarSaldos(saldos) { 
  let json = JSON.stringify(saldos);  
  let saldoPeajes = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/notificarsaldos/' + this._userService.user.ID_USER, saldoPeajes, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Notificacion enviada correctamente.', 'success');
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
// End Notificar saldos peaje

// Descontar saldos peaje
descontarSaldosPeaje(saldos) { 
  let json = JSON.stringify(saldos);  
  let saldoPeajes = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/descontarsaldospeajes/' + this._userService.user.ID_USER, saldoPeajes, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Notificacion enviada correctamente.', 'success');
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
// End Descontar saldos peaje

// Metodo para exportar a excel descuento de peajes de conductores
getExcelDescuentoPeaje(desde, hasta, search) {
  if (search === '') {
    search = '0';
  }    
  let params = desde + '/' + hasta + '/' + search;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/excel/descuentopeaje/' + params, {responseType: 'blob', headers})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar a excel descuento de peajes de conductores

// Metodo para exportar a excel documentos de conductor
getExelDocumentosConductor() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/excel/documentosConductor', {responseType: 'blob', headers})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar a excel documentos de conductor

// FIN CONDUCTOR
////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////
// OPERACIONES

// Get Ordenes servicios guias
getOrdenServicio(idUser) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/os/' + idUser, {headers})
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

// Get Orden servicio planificacion
getOrdenServicioPlanificacion(desde, hasta, idZona) {
  // let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  // return this._http.get(this.URL + '/operaciones/osPlanificacion', {headers})
  // .pipe(map((res: any) => {
  //   return res;
  // }))
  // .pipe(catchError( (err: any) => {
  //   if (err.status === 400) {
  //     Swal.fire('Mensaje', err.error.message, 'error');
  //     return throwError(err);
  //   } else {
  //     Swal.fire('Mensaje', 'No se pudo consultar las ordenes de servicio.', 'error');
  //     return throwError(err);
  //   }
  // }));
  let params = desde + '/' + hasta + '/' + idZona
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/osPlanificaciones/' + params, {headers})
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
// End Get Orden planificacion


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
    Swal.fire('Mensaje', 'Gu{ia Registrada Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registar la guía.', 'error');
      return throwError(err);
    }
  }));
}
// End Register Guia

// Get Guia
getGuia(id, idUser) {
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
      Swal.fire('Mensaje', 'No se pudo consultar la guía.', 'error');
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
    Swal.fire('Mensaje', 'Guía Actualizada Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo registar la guía.', 'error');
      return throwError(err);
    }
  }));
}
// End Update Guia

// Update Guia
asignarGuia(guia) { 
  let json = JSON.stringify(guia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/asignarGuia', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Guía Asignada Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo asignar la guía.', 'error');
      return throwError(err);
    }
  }));
}
// End Update Guia

// Get Guias
getGuias(search,desde, hasta, idUser) {
  let params = idUser + '/' + search + '/' + desde + '/' + hasta;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/guias/' + params,{headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el listado de guías.', 'error');
    return throwError(err);
  }));
}
// End Get Guias

// // Consulta Get Guias
// consultaGetGuias(search,desde, hasta) {
//   let params = this._userService.user.ID_USER + '/' + search + '/' + desde + '/' + hasta;
//   let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
//   return this._http.get(this.URL + '/operaciones/consultaguias/' + params, {headers})
//   .pipe(map((res: any) => {
//     return res;
//   }))
//   .pipe(catchError( (err: any) => {   
//     Swal.fire('Mensaje', 'No se pudo consultar el listado de guias.', 'error');
//     return throwError(err);
//   }));
// }
// // End Get Guias


// Delete Guia
deleteGuia(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/operaciones/guia/' + id, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Guía anulada correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la guía.', 'error');
      return throwError(err);
    }
  }));
}
// End Get Guia

// Metodo para exportar a excel listado de guias
getGuiasExcel(search,desde, hasta, idUser) {
  if (search === '') {
    search = '0';
  }    
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idUser + '/' + search + '/' + desde + '/' + hasta;
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
  return this._http.post(this.URL + '/operaciones/reportopviajes/' + parametros, params, {headers})
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

// Update fecha guia control
updateFechaGuiaControl(dataGuia) { 
  let json = JSON.stringify(dataGuia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/fechacontrolguia', params, {headers})
  .pipe(map((res: any) => {
    // Swal.fire('Mensaje', 'Guia Actualizada Correctamente.', 'success');
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
// End Update fecha guia control

// Update linea fecha guia control
updateLineaFechaGuiaControl(dataGuia) { 
  let json = JSON.stringify(dataGuia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/lineafechacontrolguia', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro Actualizado Correctamente.', 'success');
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
// End Update linea fecha guia control

// Update fechas guia control
updateFechasGuiaControl(dataGuia) { 
  let json = JSON.stringify(dataGuia);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/fechascontrolguia', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro Actualizado Correctamente.', 'success');
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
// End Update fechas guia control

// Get Guias control viaje
getGuiasControlViaje(search,desde, hasta, idUser,idZona) {
  let params = idUser + '/' + search + '/' + desde + '/' + hasta + '/' + idZona;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/guiascontrolviajes/' + params,{headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'No se pudo consultar el listado de guías.', 'error');
    return throwError(err);
  }));
}
// End Get Guias


// Get tiempo tardanza control viajes
getTiempoTardanzaControlViajes(fhInicioViahe,idTracto) {
  let params = fhInicioViahe + '/' + idTracto;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/tiempotardanzaviaje/' + params,{headers})
  .pipe(map((res: any) => {
    return res.datosTiempo.TIEMPO_TARDANZA;
  }))
  .pipe(catchError( (err: any) => {   
    Swal.fire('Mensaje', 'Error en la petición al servidor.', 'error');
    return throwError(err);
  }));
}
// End Get tiempo tardanza control viajes

// Tiempo tardanza contro viajes
tiempoTardanzaControlViajes(fhInicioViahe,idTracto): Promise<any> {
  return new Promise((resolve, reject) => {
      this.getTiempoTardanzaControlViajes(fhInicioViahe,idTracto).subscribe(
        (response) => {
          resolve(response);
        }, () => {
          reject(0);
        }
      );    
  });
}
// Tiempo tardanza contro viajes

// Get origenes-destinos
getOrigenesDestinos(fgDestino) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/origenesdestinos/' + fgDestino, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get origenes-destinos

// Get tipo cargas
getTipoCargas() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/tipocargas', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get tipo cargas

// Get productos
getProductos() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/productos', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get productos

// Register ruta
registerRuta(ruta) { 
  let json = JSON.stringify(ruta);  
  let dataRuta = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/ruta', dataRuta, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Ruta registrada correctamente.', 'success');
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
// End Register Ruta

// Get ruta
getRuta(idRuta) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/ruta/' + idRuta, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    this._router.navigate(['/rutas']);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo realizar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// Fin Get ruta

// Get rutas
getRutas(search) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/rutas/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get productos

// Update ruta
updateRuta(ruta) { 
  let json = JSON.stringify(ruta);  
  let dataRuta = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/ruta', dataRuta, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Ruta actualizada correctamente.', 'success');
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
// End update Ruta

// Delete ruta
deleteRuta(ruta) { 
  let params = ruta.ID_RUTA + '/' + ruta.ID_USUARIO 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/ruta/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Ruta anulada correctamente.', 'success');
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
// End delete Ruta

// Aprobar ruta
aprobarRuta(ruta) { 
  let params = ruta.ID_RUTA + '/' + ruta.ID_USUARIO 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/aprobarRuta/' + params, {},{headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Ruta actualizada correctamente.', 'success');
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
// End delete Ruta

// Get deta ruta tipo cargas
getDetaRutaTipoCargas(idRuta) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/detarutatipocargas/' + idRuta, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get deta ruta tipo cargas

// Get deta productos
getDetaRutaProductos(idRuta) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/detarutaproductos/' + idRuta, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get deta productos

// Delete deta ruta tipo carga
deleteDetaRutaTipoCarga(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/detarutatipocarga/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
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
// End delete deta ruta tipo carga

// Delete deta ruta producto
deleteDetaRutaProducto(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/detarutaproducto/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
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
// End delete deta ruta producto

// Register deta ruta tipo carga
registerDetaRutaTipoCarga(id, idRuta) { 
  let params = id + '/' + idRuta + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/detarutatipocarga/' + params,{}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Tipo de carga registrado correctamente.', 'success');
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
// End delete deta ruta tipo carga

// Register deta ruta producto
registerDetaProducto(id, idRuta) { 
  let params = id + '/' + idRuta + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/detarutaproducto/' + params, {}, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Producto registrado correctamente.', 'success');
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
// End delete deta ruta producto

// Get conductores
getConductores(search) {
  if (search === '') {
    search = '0';
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/conductor/conductores/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get conductores

// Get documentos conductores
getDocConductores(search) {
  if (search === '') {
    search = '0'
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosConductor/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos conductores

// Get documentos conductores
getDocConductoresCliente(search) {
  if (search === '') {
    search = '0'
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosConductorCliente/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos conductores

// Register documento conductor
registerDocConductor(documento) { 
  let json = JSON.stringify(documento);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoConductor', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
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
// End Register documento conductor

// Update documento conductor
updateDocConductor(documento) { 
  let json = JSON.stringify(documento);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/documentoConductor', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento modificado correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo modificar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Update documento conductor

// Delete documento conductor
deleteDocConductor(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/documentoConductor/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete documento conductor

// Get documentos unidad
getDocUnidades(search) {
  if (search === '') {
    search = '0'
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosUnidad/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos unidad

// Get documentos unidad
getDocUnidadesCliente(search) {
  if (search === '') {
    search = '0'
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosUnidadCliente/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos unidad

// Register documento unidad
registerDocUnidad(documento) { 
  let json = JSON.stringify(documento);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoUnidad', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
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
// End Register documento conductor

// Update documento unidad
updateDocUnidad(documento) { 
  let json = JSON.stringify(documento);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/documentoUnidad', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento modificado correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo modificar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End Update documento unidad

// Delete documento unidad
deleteDocUnidad(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/documentoUnidad/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete documento unidad

// Get unidades
getUnidades(search) {
  if (search === '') {
    search = '0';
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/unidades/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get unidades

// Get unidad
getUnidad(placa) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/unidad/' + placa, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar el el registro.', 'error');
      return throwError(err);
    }
  }));
}
// Fin Get unidad

// Get unidades disponibles
getUnidadesDisponibles(idTipo) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/unidadesDisponibles/' + idTipo, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
    return throwError(err);
  }));
}
// Fin Get unidades disponibles

// Get conductores disponibles
getConductoresDisponibles() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/conductoresDisponibles', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {    
    Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
    return throwError(err);
  }));
}
// Fin Get conductores disponibles

// Register planificacion Op
registerPlanifiacionOp(planifiacion) { 
  let json = JSON.stringify(planifiacion);  
  let data = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/operaciones/planificacionOp', data, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Planificación registrada correctamente.', 'success');
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
// End Register planificacion Op

// Get orden servicio
getOS(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/ordenServicio/' + id, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    this._router.navigate(['/planificacion-operaciones', 0]);
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
      return throwError(err);
    }
  }));
}
// Fin Get orden servicio

// Get planificacion OP
getPlanificacionOP(id) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/planificacionOp/' + id, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      this._router.navigate(['/planificacion-operaciones', 0]);
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
      return throwError(err);
    }
  }));
}
// Fin Get planificacion OP

// Get planificacion deta
getPlanificacionDeta(idPlanificacion) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/planificacionDeta/' + idPlanificacion, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {    
    Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
    return throwError(err);
  }));
}
// Fin Get planificacion deta


// Get planificaciones deta
getPlanificacionesDeta(desde, hasta, idZona) {
  let paramas = desde + '/' + hasta + '/' + idZona
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/planificacionesDeta/' + paramas, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {    
    Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
    return throwError(err);
  }));
}
// Fin Get planificacion deta

// Register planificacion Op deta
registerPlanifiacionOpDeta(planifiacion) { 
  let json = JSON.stringify(planifiacion);  
  let data = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/operaciones/planificacionOpDeta', data, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
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
// End Register planificacion Op deta

// Get planificaciones op
getPlanificacionesOp(search, desde, hasta) {
  if (search === '') {
    search = '0';
  }
  let params = search + '/' + desde + '/' + hasta;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/operaciones/planificacionesOp/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {    
    Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
    return throwError(err);
  }));
}
// Fin Get planificaciones op

// Delete planifiacion op
deletePlanificacionOp(id, idOs) { 
  let params = id + '/' +  idOs + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/operaciones/planificacionOp/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete planificacion op

// Delete planifiacion op deta
deletePlanificacionOpDeta(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/operaciones/planificacionOpDeta/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete planificacion op deta

// Get guia planificacion
getGuiaPlanificacion(idOrden, idConductor) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idOrden + '/' + idConductor;
  return this._http.get(this.URL + '/operaciones/guiaPlanificacion/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo consultar la información.', 'error');
      return throwError(err);
    }
  }));
}
// Fin Get guia planificacion

// Update fechas planificacion guia
updateFechaPlanificacionGuia(guia) { 
  let json = JSON.stringify(guia);  
  let dataGuia = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/operaciones/planificacionOpGuia', dataGuia, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {   
    if (err.status === 400) {
      Swal.fire('Mensaje', err.error.message, 'error');
      return throwError(err);
    } else {
      Swal.fire('Mensaje', 'No se pudo actuliazar el registro.', 'error');
      return throwError(err);
    }
  }));
}
// End fechas planificacion guia

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

// Get agenda telefonica
getAgendaTelefonica(search) {
  if (search === '') {
    search = '0';
  }
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/user/agendatelefonica/' + search, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get agenda telefonica

// Get clasificacion documentos
getClasificacionDocBriane() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/clasificaciondocbriane', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get clasificacion documentos

// Get categoria documentos
getCategoriaDocBriane(idClasificacion) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/categoriadocbriane/' + idClasificacion, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get categoria documentos

// Get areas documentos
getAreasBriane() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/areasbriane', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get areas documentos

// Get documentos BRIANE
getDocumentosBriane(idClasificacion, idCategoria, idArea) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = idClasificacion + '/' + idCategoria + '/' + idArea;
  return this._http.get(this.URL + '/register/documentosbriane/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos BRIANE

// Get empleados rrhh genesys
getEmpleadosRhhGenesys(desde, hasta) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = desde + '/' + hasta;
  return this._http.get(this.URL + '/register/empleadosrrhhgenesys/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get empleados rrhh genesys

// Get empleados rrhh genesys bajas
getEmpleadosRhhGenesysBajas(desde, hasta) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  let params = desde + '/' + hasta;
  return this._http.get(this.URL + '/register/empleadosrrhhgenesysbajas/' + params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get empleados rrhh genesys bajas

// Get clientes-proveedores
getClientes() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/clientes', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get clientes-proveedores

// Get monedas
getMonedas() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/monedas', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get monedas

// Get tipo cobros ordenes servicios
getTipoCobrosOs() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/tipocobrosos', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get tipo cobros ordenes servicios

// Register documento cliente
registerDocCliente(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoCliente', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
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
// End Register documento cliente

// Get documentos cliente conductor
getDocClientes(idCliente) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosCliente/' + idCliente, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos cliente conductor

// Delete documento cliente conductor
deleteDocCliente(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/documentoCliente/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete documento cliente conductor 

// Register relacion documento conductor
registerDocConductorRelacion(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoConductorRelacion', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
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
// End Register relacion documento conductor

// Get relacion documentos conductor total
getDocConductorTotal(idCliente, idConductor) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosConductorTotal/' + idCliente + '/' + idConductor, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get relacion documentos conductor total

// Update relacion documento conductor
updateDocCondcutor(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/documentoConductorRelacion', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
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
// End Update relacion documento conductor


// Register documento cliente unidad
registerDocClienteUnidad(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoClienteUnidad', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
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
// End Register documento cliente

// Get documentos cliente unidad
getDocClientesUnidad(idCliente) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosClienteUnidad/' + idCliente, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get documentos cliente unidad

// Delete documento cliente unidad
deleteDocClienteUnidad(id) { 
  let params = id + '/' + this._userService.user.ID_USER;
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/register/documentoClienteUnidad/' + params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
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
// End Delete documento cliente conductor

// Get relacion documentos unidad total
getDocUnidadTotal(idCliente, idUnidad) {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/documentosUnidadTotal/' + idCliente + '/' + idUnidad, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get relacion documentos conductor total

// Register relacion documento unidad
registerDocUnidadRelacion(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/register/documentoUnidadRelacion', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
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
// End Register relacion documento unidad

// Update relacion documento unidad
updateRelacionDocUnidad(data) { 
  let json = JSON.stringify(data);  
  let dataDocumento = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.put(this.URL + '/register/documentoUnidadRelacion', dataDocumento, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
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
// End Update relacion documento conductor

// Metodo para exportar a excel documentos de unidad
getExelDocumentosUnidad() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/excel/documentosUnidad', {responseType: 'blob', headers})
  .pipe(map((res: any) => {     
    return res;
  }))
  .pipe(catchError( (err: any) => {
      Swal.fire('Mensaje', 'No se pudo exportar la información', 'error');
      return throwError(err);
  }));
}
// Fin Metodo para exportar a excel documentos de unidad

// Get tipo documentos conductor
getTipoDocumentosConductor() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/tipoDocumentosConductor', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get tipo documentos conductor


// Get tipo documentos unidad
getTipoDocumentosUnidad() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/tipoDocumentosUnidad', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get tipo documentos unidad

// Get cantidad dias tramite documentos unidad-conductor
getDiasTramiteUnidadCond() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/cantidadDiasTramiteDocumentos', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get cantidad dias tramite documentos unidad-conductor

// Get cantidad dias tramite documentos unidad-conductor
getConceptosGatosOp() {
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.get(this.URL + '/register/conceptosGatosOp', {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get cantidad dias tramite documentos unidad-conductor


// Subir documento de conductor
// uploadFileConductor(file: File, id, idConductor) {
//   this._uploadFileService.uploadFile(file, 'documentos-conductor', id, idConductor)
//       .then( (resp: any) => {
//         Swal.fire('Mensaje', 'Archivo Actualizado Correctamente', 'success');
        
//       })
//       .catch( resp => {
//         Swal.fire('Error', 'No se pudo subir el archivo', 'warning');
//       });
//  }
// Fin Subir documento de conductor

// Administracion
/////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
// APIS EXTERNAS

// Get marcajes sistema Qwantec
marcajesQwantec(data) {
  let json = JSON.stringify(data);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this._http.post('https://app.relojcontrol.com/api/consultaMarcaciones/consulta',params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Fin Get marcajes sistema Qwantec

// Altas, bajas y actualizacion de empleados 
sincronizarEmpleadosQwantec(data) {
  let json = JSON.stringify(data);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this._http.post('https://app.relojcontrol.com/api/actualizarEmpleados/importar',params, {headers})
  .pipe(map((res: any) => {
    return res;
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
    return throwError(err);
  }));
}
// Altas, bajas y actualizacion de empleados 

// // marcajes
// prueba() {
  
//   let headers = new HttpHeaders({'Content-Type': 'application/json'});
//   return this._http.get('https://jsonplaceholder.typicode.com/todos', {headers})
//   .pipe(map((res: any) => {
//     // console.log(res);
//     return res;
//   }))
//   .pipe(catchError( (err: any) => {
//     Swal.fire('Mensaje', 'No se pudo consultar la información', 'error');
//     return throwError(err);
//   }));
// }
// // Fin post marcajes

// APIS EXTERNAS
///////////////////////////////////////////////////////////////////////////////////////////////

}
