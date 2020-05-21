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


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public URL: string;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _http: HttpClient,
    // tslint:disable-next-line: variable-name
    public _router: Router
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
// End Get Clients

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

}
