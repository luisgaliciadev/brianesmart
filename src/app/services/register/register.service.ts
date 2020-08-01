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
   console.log(res);
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
registerViatico(viaticos) { 
  let json = JSON.stringify(viaticos);  
  let params = json;  
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.post(this.URL + '/conductor/viatico', params, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Viatico Registrado Correctamente.', 'success');
    return res;
  }))
  .pipe(catchError( (err: any) => {
    
    Swal.fire('Mensaje', 'No se pudo registrar el viatico.', 'error');
    return throwError(err);
    
  }));
}
// End Register Viatico

// Get verificar viatico
getVerificarViatico(idConductor, dia) {
  var fhDia = dia
  var arrayFhDia = fhDia.split("/");
  fhDia = arrayFhDia[2] + '-' + arrayFhDia[1] + '-' + arrayFhDia[0];
  return this._http.get(this.URL + '/conductor/verificarviatico/' + idConductor + '/' + fhDia)
  .pipe(map((res: any) => {
    // console.log(res);
    if (res.idViatico > 0) {
      Swal.fire('Mensaje', 'Este registro de viatico ya existe.', 'warning');
      return false;
    } else {
      return true;
    }
  }))
  .pipe(catchError( (err: any) => {
    Swal.fire('Mensaje', 'No se pudo verificar la informacón.', 'error');
    return throwError(err);
  }));
}
// End Get verificar viatico

// Get Viaticos
getViaticos(desde, hasta, search) { 
  if (search === '') {
    search = '0'
  } 
  return this._http.get(this.URL + '/conductor/viaticos/' + desde + '/' + hasta + '/' + search)
  .pipe(map((res: any) => {
    // console.log(res); 
    return res;   
  }))
}
// End Get Viaticos

// Get Viatico
getViatico(nroSemana, zona) { 
  return this._http.get(this.URL + '/conductor/viatico/' + nroSemana + '/' + zona)
  .pipe(map((res: any) => {
    return res;   
  }))
}
// End Get Viatico

// Get Deta Viatico
getDetaViatico(nroSemana, zona) { 
  return this._http.get(this.URL + '/conductor/detaviatico/' + nroSemana + '/' + zona)
  .pipe(map((res: any) => {
    return res;   
  }))
}
// End Get Deta Viatico

// Delete viaticos
deleteViaticos(nroSemana, zona) { 
  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this._userService.token});
  return this._http.delete(this.URL + '/conductor/viaticos/' + nroSemana + '/' + zona, {headers})
  .pipe(map((res: any) => {
    Swal.fire('Mensaje', 'Viaticos Anulado Correctamente.', 'success');
    return res;   
  }))
}
// End Delete Viaticos






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
// End Get conductor

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
    Swal.fire('Mensaje', 'No se pudo consultar el listado de guias.', 'error');
    return throwError(err);
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
// End Get cliete

// Administracion
/////////////////////////////////////////////////////////////////////////////////////////////////
}
