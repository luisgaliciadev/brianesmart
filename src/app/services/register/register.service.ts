import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
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
  public URL = environment.URL_SERVICES;
 
  constructor(
    public _userService: UserService,
    public _http: HttpClient,
    public _router: Router,
    public _uploadFileService: UploadFileService
  ) {}

  // Get Type Id Client
  getIdTypeClient() {
    return this._http.get(this.URL + '/register/idtypeclient').pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Type Id Client

  // Get Type Client
  getTypeClient() {
    return this._http.get(this.URL + '/register/typeclient').pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Type Client

  // Register Client
  registerClient(client: Client) { 
    let json = JSON.stringify(client);  
    let params = json;  
    return this._http.post(this.URL + '/register/client', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Cliente Registrado Correctamente.', 'success');
      return res.client;
    }));
  }
  // End Register Client

  // Update Client
  updateClient(client: Client) { 
    let json = JSON.stringify(client);  
    let params = json;  
    return this._http.put(this.URL + '/register/client', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Cliente Actualizado Correctamente.', 'success');
      return res.client;
    }));
  }
  // End Update Client

  // Delete Client
  deleteClient(id) {
    return this._http.delete(this.URL + '/register/client/' + id).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Cliente Eliminado Correctamente.', 'success');
      return true;
    }));
  }
  // End Delete Client

  // Get Clients
  getClients(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/register/clients/' + search + '/' + this._userService.user.ID_USER).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Clients

  // Get Client
  getClient(idClient) {
    return this._http.get(this.URL + '/register/client/' + idClient + '/' + this._userService.user.ID_USER).pipe(map((res: any) => {
        return res.client;
    }));
  }
  // End Get Client

  // Register Address Client
  registerAddress(addressClient: AddressClient, principal: boolean) { 
    let json = JSON.stringify(addressClient);  
    let params = json;  
    return this._http.post(this.URL + '/register/address', params).pipe(map((res: any) => {
      if (!principal) {
        Swal.fire('Mensaje', 'Sucursal registrada correctamente.', 'success');
      }
      return res;
    }));
  }
  // End Register Address Client

  // Update Address Client
  UpdateAddress(addressClient: AddressClient, idAddress: number) {
    let json = JSON.stringify(addressClient);
    let params = json;
    return this._http.put(this.URL + '/register/addressupdate/' + idAddress, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Sucursal Actualizada correctamente.', 'success');
      return res.address;
    }));
  }
  // End Update Address Client

  // Get address Client
  getAddressClient(idAddress: number, idUser) {
    return this._http.get(this.URL + '/register/address/' + idAddress + '/' + idUser).pipe(map((res: any) => {
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
    return this._http.get(this.URL + '/register/address/' + idClient).pipe(map((res: any) => {
      return res.address;
    }));
  }
  // End Get Address Clients

  // Establecer direccion principal de cliente
  defaultAddressClient(addressClient: AddressClient, idAddress: number) {
    let json = JSON.stringify(addressClient);
    let params = json;
    return this._http.put(this.URL + '/register/defaultaddress/' + idAddress, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Sucursal principal establecida correctamente.', 'success');
      return res;
    }));
  }
  // Fin de Establecer direccion principal de empresa

  // Delete Address Client
  deleteAddressClient(id: number) {
   return this._http.delete(this.URL + '/register/address/' + id).pipe(map((res: any) => {
     Swal.fire('Mensaje', 'Sucursal Eliminada Correctamente.', 'success');
     return true;
   }));
  }
  // End Delete Address Client

  // Register Denuncias
  registerDenuncia(denuncia: Denuncia) {
    let params = denuncia;
    return this._http.post(this.URL + '/register/denuncia', params).pipe(map((res: any) => {
        Swal.fire('Mensaje', 'Denuncia registrada correctamente', 'success');
        return res;
    }));
  }
  // End Register Denuncias

  // Get denuncias
  getDenuncias(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/register/denuncias/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get denuncias

  // Get denuncias
  getDenuncia(idDenuncia) {
    return this._http.get(this.URL + '/register/verdenuncia/' + idDenuncia).pipe(map((res: any) => {
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
    return this._http.delete(this.URL + '/register/denuncia/' + id).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Denuncia Eliminada Correctamente.', 'success');
      return true;
    }));
  }
  // End Delete Denuncia

  // Metodo para exportar a excel listado de denuncias
  getDenunciasExcel(search) {
    if (search === '') {
      search = '0';
    }    
    return this._http.get(this.URL + '/excel/denuncias/' + search, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar empresas

  // Subir archivo de denuncia
  uploadFileDenuncia(file: File, id: number, numArchivo: number) {
    this._uploadFileService.uploadFile(file, 'denuncia', id, numArchivo)
      .then( (resp: any) => {})
      .catch( resp => {});
   }
  // Fin Subir archivo de denuncia

  // Get zonas conductor
  getZonaConductor() {
    return this._http.get(this.URL + '/conductor/zonas').pipe(map((res: any) => {
      return res;
    }))
  }
  // End Get zonas conductor

  // Get  conductor
  getConductor(idConductor) {
    return this._http.get(this.URL + '/conductor/' + idConductor).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get conductor

  // Get datos semana
  getDatoSemana(dia) {
    return this._http.get(this.URL + '/conductor/datosemana/' + dia).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get datos semana

  // Get dias semana
  getDiasSemana(desde, hasta) {
    return this._http.get(this.URL + '/conductor/diasemana/' + desde + '/' + hasta).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get datos semana

  // Get tarifas viaticos
  getTarifasViatico(idZona) {
    return this._http.get(this.URL + '/conductor/tarifasviatico/' + idZona).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get datos semana

  // Register Viatico
  registerViatico(viaticos, semana, year, zona, montoTotal) { 
    let json = JSON.stringify(viaticos);  
    let detaViaticos = json;  
    let params = semana + '/' + year + '/' + zona + '/' + montoTotal + '/' + this._userService.user.ID_USER;
    return this._http.post(this.URL + '/conductor/viatico/' + params , detaViaticos).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Viaticos Registrado Correctamente.', 'success');
      return res;
    }));
  }
  // End Register Viatico

  // Register Viatico
  updateViatico(viaticos, semana, year, zona, montoTotal, id, nroDia) { 
    let json = JSON.stringify(viaticos);  
    let detaViaticos = json;  
    let params = semana + '/' + year + '/' + zona + '/' + montoTotal  + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/conductor/viatico/' + params , detaViaticos,).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Register Viatico

  // Get Viaticos
  getViaticos(desde, hasta, search) { 
    if (search === '') {
      search = '0'
    } 
    return this._http.get(this.URL + '/conductor/viaticos/' + desde + '/' + hasta + '/' + search).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Viaticos

  // Get Viatico
  getViatico(id) { 
    return this._http.get(this.URL + '/conductor/viatico/' + id).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Viatico

  // Get deta viaticos
  getDetaViaticos(semana, year, id, idConductor) {
    let params = semana + '/' + year + '/' + id + '/' + idConductor;
    return this._http.get(this.URL + '/conductor/detaviaticos/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get deta viticos

  // Delete viaticos
  deleteViaticos(id) { 
    return this._http.delete(this.URL + '/conductor/viatico/' + id + '/' + this._userService.user.ID_USER).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Viaticos Anulados Correctamente.', 'success');
      return res;   
    }));
  }
  // End Delete Viaticos

  // Aprobar viaticos
  aprobarViaticos(id) { 
    return this._http.put(this.URL + '/conductor/aprobarviatico/' + id + '/' + this._userService.user.ID_USER,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Viaticos Aprobados Correctamente.', 'success');
      return res;   
    }));
  }
  // End Aprobar viaticos

  // Generar comprobantes viticos
  generarComprobantes(id) { 
    return this._http.put(this.URL + '/pdf/movilidadcond/' + id + '/' + this._userService.user.ID_USER, {}).pipe(map((res: any) => {
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
    return this._http.get(this.URL + '/pdf/pdfdetaviatico/' + idViatico + '/' + idConductor).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Generar comprobantes viticos

  // Generar nuevo comprobante viticos por conductor
  generarNuevoComprobanteConductor(idViatico, idConductor) { 
    return this._http.get(this.URL + '/pdf/renewpdfviatico/' + idViatico + '/' + idConductor).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Generar nuevo comprobante viticos por conductor

  // Get reporte productividad conductor
  getRepProductividadCond(semana, year, zona) {
    let params = semana + '/' + year + '/' + zona;
    return this._http.get(this.URL + '/conductor/productividad/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get reporte productividad conductor

  // Get Viajes/horas
  getViajesHoras(search,desde, hasta, dni, zona) {
    let params = desde + '/' + hasta + '/' + dni + '/' + search + '/' + zona;
    return this._http.get(this.URL + '/conductor/viajeshorascomision/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Guias

  // Get resumen viaticos
  getResumenViaticos(idViatico) {
    let params = idViatico;
    return this._http.get(this.URL + '/conductor/resumenviaticos/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get resumen viticos

  // Get resumen viaticos por conductor
  getResumenViaticosPorConductor(idConductor, desde, hasta) {
    let params = idConductor + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/conductor/resumenviaticosporconductor/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get resumen viticos

  // Get detalle viaticos por conductor
  getDetaViaticoPorConductor(idViatico, idConductor) {
    let params = idViatico + '/' + idConductor;
    return this._http.get(this.URL + '/conductor/detaviaticoporconductor/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get detalle viticos

  // Register Peaje
  registerPeaje(peajes) { 
    let json = JSON.stringify(peajes);  
    let DataPeajes = json;  
    return this._http.post(this.URL + '/conductor/peaje', DataPeajes).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Peajes Registrado Correctamente.', 'success');
      return res;
    }));
  }
  // End Register Peaje

  // Register deta Peaje
  registerDetaPeaje(peajes) { 
    let json = JSON.stringify(peajes);  
    let DataPeajes = json;  
    return this._http.post(this.URL + '/conductor/detapeaje', DataPeajes).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Register deta Peaje

  // Get Peajes
  getPeajes(search, desde, hasta) { 
    return this._http.get(this.URL + '/conductor/peajes/' + desde + '/' + hasta + '/' + search).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Peajes

  // Get Peajes saldos
  getPeajeSaldos(search, desde, hasta) { 
    return this._http.get(this.URL + '/conductor/peajesaldos/' + desde + '/' + hasta + '/' + search).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Peajes saldos

  // Get Peajes descuentos
  getPeajeDescuentos(search, desde, hasta) { 
    return this._http.get(this.URL + '/conductor/peajesdescuentos/' + desde + '/' + hasta + '/' + search).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Peajes descuentos

  // Get Peaje
  getPeaje(idPeaje) { 
    return this._http.get(this.URL + '/conductor/peaje/' + idPeaje).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Peaje

  // Update Peaje
  updatePeaje(peajes) { 
    let json = JSON.stringify(peajes);  
    let DataPeajes = json;  
    return this._http.put(this.URL + '/conductor/peaje', DataPeajes).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Peajes Actualizado Correctamente.', 'success');
      return res;
    }));
  }
  // End Update Peaje

  // Delete detalle Peaje
  deleteDetaPeaje(idPeaje, idDeta) { 
    let parametros = idPeaje + '/' + idDeta + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/conductor/detapeajes/' + parametros).pipe(map((res: any) => {
      return res;   
    }));
  }

  // Delete Peaje
  deletePeaje(idPeaje) { 
    let parametros = idPeaje + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/conductor/peaje/' + parametros).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Peajes Anulados Correctamente.', 'success');
      return res;   
    }));
  }
  // End Delete Peaje
  
  // Register Peaje factura
  registePeajeFact(factura) { 
    let json = JSON.stringify(factura);  
    let dataFactura = json;  
    return this._http.post(this.URL + '/conductor/peajefact', dataFactura).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Factura Registrada Correctamente.', 'success');
      return res;
    }));
  }
  // End Register Peaje factura
  
  // Get Peajes facturas
  getPeajeFacturas(idDeta) { 
    return this._http.get(this.URL + '/conductor/peajefact/' + idDeta).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get Peajes facturas
  
  // Get verificar guia
  getVerificarNroGuia(correlativo, DNI) { 
    return this._http.get(this.URL + '/operaciones/nroguiacond/' + correlativo + '/' + DNI).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get verificar guia

  // Delete Peaje factura
  deletePeajeFact(id) { 
    let parametros = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/conductor/peajefact/' + parametros).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Factura eliminada Correctamente.', 'success');
      return res;   
    }));
  }
  // End Delete Peaje

  // Get documentos peajes
  getDocPeajes() { 
    return this._http.get(this.URL + '/conductor/peajes/documentos').pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get documentos peajes

  // Update deta Peaje
  updateDetaPeaje(idDeta,valor) { 
    let params = idDeta + '/' + valor + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/conductor/detapeaje/' + params,{}).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Update deta Peaje

  // Update all deta Peaje
  updateAllDetaPeaje(idPeaje,valor) { 
    let params = idPeaje + '/' + valor + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/conductor/alldetapeaje/' + params,{}).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Update deta Peaje
  
  // Get excel deta peaje telecredito
  getExcelPeajeTelecredito(idPeaje){
    return this._http.get(this.URL + '/excel/detapeajetelecredito/' + idPeaje, {responseType: 'blob'})
    .pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel deta peaje telecredito

  // Procesar Peaje
  procesarPeaje(idPeaje) { 
    let params = idPeaje + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/conductor/procesarpeaje/' + params,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Solicitud procesada correctamente.', 'success');
      return res;
    }));
  }
  // End Procesar Peaje

  // Liquidar Peaje
  liquidarPeaje(idPeaje) { 
    let params = idPeaje + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/conductor/liquidarpeaje/' + params,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Solicitud liquidada correctamente.', 'success');
      return res;
    }));
  }
  // End Liquidar Peaje

  // Metodo para exportar a excel saldo de peajes de conductores
  getExcelSaldosPeaje(desde, hasta, search) {
    if (search === '') {
      search = '0';
    }    
    let params = desde + '/' + hasta + '/' + search;
    return this._http.get(this.URL + '/excel/saldospeaje/' + params, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar a excel saldo de peajes de conductores

  // Notificar saldos peaje
  notificarSaldos(saldos) { 
    let json = JSON.stringify(saldos);  
    let saldoPeajes = json;  
    return this._http.post(this.URL + '/conductor/notificarsaldos/' + this._userService.user.ID_USER, saldoPeajes).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Notificación enviada correctamente.', 'success');
      return res;
    }));
  }
  // End Notificar saldos peaje

  // Descontar saldos peaje
  descontarSaldosPeaje(saldos) { 
    let json = JSON.stringify(saldos);  
    let saldoPeajes = json;  
    return this._http.post(this.URL + '/conductor/descontarsaldospeajes/' + this._userService.user.ID_USER, saldoPeajes).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Notificacion enviada correctamente.', 'success');
      return res;
    }));
  }
  // End Descontar saldos peaje

  // Metodo para exportar a excel descuento de peajes de conductores
  getExcelDescuentoPeaje(desde, hasta, search) {
    if (search === '') {
      search = '0';
    }    
    let params = desde + '/' + hasta + '/' + search;
    return this._http.get(this.URL + '/excel/descuentopeaje/' + params, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar a excel descuento de peajes de conductores

  // Metodo para exportar a excel documentos de conductor
  getExelDocumentosConductor() {
    return this._http.get(this.URL + '/excel/documentosConductor', {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar a excel documentos de conductor

  // Get excel deta peaje fact
  getExcelPeajeFact(idDeta) {
    return this._http.get(this.URL + '/excel/peajefact/' + idDeta, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel deta peaje fact

  // Get excel deta peaje fact total
  getExcelPeajeFactTotal(idPeaje) {
    return this._http.get(this.URL + '/excel/peajeFactTotal/' + idPeaje, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel deta peaje fact

  // Get excel deta peaje fact total
  getExcelDetaPeajes(search, desde, hasta) {
    if (search === '') {
      search = '0'
    }
    let params = search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/excel/peajesDeta/' + params, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel deta peaje fact

   // Get viajes diferencia peso
    getViajesDifPeso(search, desde, hasta) { 
    let params = search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/conductor/viajesDiferenciaPesoTotal/' + params,).pipe(map( (res: any) => {          
      return res;            
    }));
   }
   // Fin Get viajes diferencia peso
  
  // Get Ordenes servicios guias
  getOrdenServicio(idUser) {
    return this._http.get(this.URL + '/operaciones/os/' + idUser).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Orden servicio

  // Get Orden servicio all
  getOrdenServicioAll(id) {
    return this._http.get(this.URL + '/operaciones/osall/' + id).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Orden servicio

  // Get Orden servicio planificacion
  getOrdenServicioPlanificacion(desde, hasta, idZona) {
    let params = desde + '/' + hasta + '/' + idZona
    return this._http.get(this.URL + '/operaciones/osPlanificaciones/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Orden planificacion

  // Get Vehiculo
  getVehiculo(placa, tipo) {
    return this._http.get(this.URL + '/operaciones/vehiculo/' + placa + '/' + tipo).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Vehiculo

  // Register Guia
  registerGuia(guia) { 
    let json = JSON.stringify(guia);  
    let params = json;  
    return this._http.post(this.URL + '/operaciones/guia', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Gu{ia Registrada Correctamente.', 'success');
      return res;
    }));
  }
  // End Register Guia

  // Get Guia
  getGuia(id, idUser) {
    return this._http.get(this.URL + '/operaciones/guia/' + id + '/' + idUser).pipe(map((res: any) => {
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
    return this._http.put(this.URL + '/operaciones/guia', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Guía Actualizada Correctamente.', 'success');
      return res;
    }));
  }
  // End Update Guia

  // Update Guia
  asignarGuia(guia) { 
    let json = JSON.stringify(guia);  
    let params = json;  
    return this._http.put(this.URL + '/operaciones/asignarGuia', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Guía Asignada Correctamente.', 'success');
      return res;
    }));
  }
  // End Update Guia
  
  // Get Guias
  getGuias(search,desde, hasta, idUser) {
    let params = idUser + '/' + search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/operaciones/guias/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Guias

  // Delete Guia
  deleteGuia(id) {
    return this._http.delete(this.URL + '/operaciones/guia/' + id).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Guía anulada correctamente.', 'success');
      return res;
    }));
  }
  // End Get Guia

  // Metodo para exportar a excel listado de guias
  getGuiasExcel(search,desde, hasta, idUser) {
    if (search === '') {
      search = '0';
    }    
    let params = idUser + '/' + search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/excel/guias/' + params, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar empresas

  // Get productividad OP
  getProductividadop(tipo,semana, year, desde, hasta,zona) {
    let params = semana + '/' + year + '/' + zona;
    return this._http.get(this.URL + '/operaciones/diasproductividadop/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get productividad OP

  // Get years
  getYears() {
    return this._http.get(this.URL + '/operaciones/years').pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get years

  // Get motivo no op
  getMotivoNoOp() {
    return this._http.get(this.URL + '/operaciones/motivonoop').pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get motivo no op

  // Register Report OP
  registerReportPro(diasproductividadop, nroSemana, anio, zona) { 
    let json = JSON.stringify(diasproductividadop);  
    let params = json;  
    let parametros = nroSemana + '/' + anio + '/' + zona + '/' + this._userService.user.ID_USER
    return this._http.post(this.URL + '/operaciones/reportop/' + parametros, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado Correctamente.', 'success');
      return res;
    }));
  }
  // End Report OP

  // Register Report OP nuevos viajes
  registerReportProNuevos(diasproductividadop, nroSemana, anio, zona, idReport) { 
    let json = JSON.stringify(diasproductividadop);  
    let params = json;  
    let parametros = nroSemana + '/' + anio + '/' + zona + '/' + this._userService.user.ID_USER + '/' + idReport;
    return this._http.post(this.URL + '/operaciones/reportopviajes/' + parametros, params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Report OP nuevos viajes

  // Update deta Report OP
  updateReportPro(diasproductividadop, nroSemana, anio, zona, id, nroDia) { 
    let json = JSON.stringify(diasproductividadop);  
    let params = json;  
    let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/operaciones/reportop/' + parametros, params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Update deta Report OP

  // Delete deta Report OP
  updateDetaReportPro(diasproductividadop, nroSemana, anio, zona, id, nroDia) { 
    let json = JSON.stringify(diasproductividadop);  
    let params = json;  
    let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + nroDia + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/operaciones/detareportop/' + parametros, params).pipe(map((res: any) => {
      return res;
    }))
  };
  // End Delete deta Report OP

  // Update Report OP viajes nuevos
  updateReportProNuevo(diasproductividadop, nroSemana, anio, zona, id) { 
    let json = JSON.stringify(diasproductividadop);  
    let params = json;  
    let parametros = nroSemana + '/' + anio + '/' + zona + '/' + id + '/' + this._userService.user.ID_USER;
    return this._http.put(this.URL + '/operaciones/reportopdeta/' + parametros, params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Update OP

  // Aprobar Reporte productividad
  aprobarReportePro(id, idZona) { 
    return this._http.put(this.URL + '/operaciones/aprobarrepportop/' + id + '/' + this._userService.user.ID_USER + '/' + idZona,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Reporte Aprobado Correctamente.', 'success');
      return res;   
    }));
  }
  // End Aprobar Reporte productividad

  // Delete Report OP
  deleteReportOP(id) { 
    return this._http.delete(this.URL + '/operaciones/reportop/' + id + '/' + this._userService.user.ID_USER).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Reporte Anulado Correctamente.', 'success');
      return res;   
    }));
  }
  // End Delete Report OP

  // Get deta report productividad
  getDetaReportPro(semana, year, id) {
    let params = semana + '/' + year + '/' + id;
    return this._http.get(this.URL + '/operaciones/detareportprodop/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get deta viticos

  // Get reportes productividad
  getReportsPro(desde, hasta, search) { 
    if (search === '') {
      search = '0'
    } 
    return this._http.get(this.URL + '/operaciones/reportspro/' + desde + '/' + hasta + '/' + search).pipe(map((res: any) => {
      return res;   
    }))
  }
  // End Get reportes productividad
  
  // Get reporte op
  getReportPro(id) { 
    return this._http.get(this.URL + '/operaciones/reportprodop/' + id).pipe(map((res: any) => {
      return res;   
    }));
  }
  // End Get reporte op

  // Update fecha guia control
  updateFechaGuiaControl(dataGuia) { 
    let json = JSON.stringify(dataGuia);  
    let params = json;  
    return this._http.put(this.URL + '/operaciones/fechacontrolguia', params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Update fecha guia control

  // Update linea fecha guia control
  updateLineaFechaGuiaControl(dataGuia) { 
    let json = JSON.stringify(dataGuia);  
    let params = json;  
    return this._http.put(this.URL + '/operaciones/lineafechacontrolguia', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro Actualizado Correctamente.', 'success');
      return res;
    }));
  }
  // End Update linea fecha guia control

  // Update fechas guia control
  updateFechasGuiaControl(dataGuia) { 
    let json = JSON.stringify(dataGuia);  
    let params = json;  
    return this._http.put(this.URL + '/operaciones/fechascontrolguia', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro Actualizado Correctamente.', 'success');
      return res;
    }));
  }
  // End Update fechas guia control

  // Get Guias control viaje
  getGuiasControlViaje(search,desde, hasta, idUser,idZona) {
    let params = idUser + '/' + search + '/' + desde + '/' + hasta + '/' + idZona;
    return this._http.get(this.URL + '/operaciones/guiascontrolviajes/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get Guias

  // Get tiempo tardanza control viajes
  getTiempoTardanzaControlViajes(fhInicioViahe,idTracto) {
    let params = fhInicioViahe + '/' + idTracto;
    return this._http.get(this.URL + '/operaciones/tiempotardanzaviaje/' + params).pipe(map((res: any) => {
      return res.datosTiempo.TIEMPO_TARDANZA;
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
    return this._http.get(this.URL + '/register/origenesdestinos/' + fgDestino).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get origenes-destinos

  // Get tipo cargas
  getTipoCargas() {
    return this._http.get(this.URL + '/register/tipocargas').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get tipo cargas

  // Get productos
  getProductos() {
    return this._http.get(this.URL + '/register/productos').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get productos

  // Register ruta
  registerRuta(ruta) { 
    let json = JSON.stringify(ruta);  
    let dataRuta = json;  
    return this._http.post(this.URL + '/register/ruta', dataRuta).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Ruta registrada correctamente.', 'success');
      return res;
    }));
  }
  // End Register Ruta
  
  // Get ruta
  getRuta(idRuta) {
    return this._http.get(this.URL + '/register/ruta/' + idRuta).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get ruta
  
  // Get rutas
  getRutas(search) {
    return this._http.get(this.URL + '/register/rutas/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get productos

  // Update ruta
  updateRuta(ruta) { 
    let json = JSON.stringify(ruta);  
    let dataRuta = json;  
    return this._http.put(this.URL + '/register/ruta', dataRuta).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Ruta actualizada correctamente.', 'success');
      return res;
    }));
  }
  // End update Ruta

  // Delete ruta
  deleteRuta(ruta) { 
    let params = ruta.ID_RUTA + '/' + ruta.ID_USUARIO;
    return this._http.delete(this.URL + '/register/ruta/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Ruta anulada correctamente.', 'success');
      return res;
    }));
  }
  // End delete Ruta

  // Aprobar ruta
  aprobarRuta(ruta) { 
    let params = ruta.ID_RUTA + '/' + ruta.ID_USUARIO 
    return this._http.put(this.URL + '/register/aprobarRuta/' + params,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Ruta actualizada correctamente.', 'success');
      return res;
    }));
  }
  // End delete Ruta

  // Get deta ruta tipo cargas
  getDetaRutaTipoCargas(idRuta) {
    return this._http.get(this.URL + '/register/detarutatipocargas/' + idRuta).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get deta ruta tipo cargas
  
  // Get deta productos
  getDetaRutaProductos(idRuta) {
    return this._http.get(this.URL + '/register/detarutaproductos/' + idRuta).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get deta productos

  // Delete deta ruta tipo carga
  deleteDetaRutaTipoCarga(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/detarutatipocarga/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
      return res;
    }));
  }
  // End delete deta ruta tipo carga
  
  // Delete deta ruta producto
  deleteDetaRutaProducto(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/detarutaproducto/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
      return res;
    }));
  }
  // End delete deta ruta producto

  // Register deta ruta tipo carga
  registerDetaRutaTipoCarga(id, idRuta) { 
    let params = id + '/' + idRuta + '/' + this._userService.user.ID_USER;
    return this._http.post(this.URL + '/register/detarutatipocarga/' + params,{}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Tipo de carga registrado correctamente.', 'success');
      return res;
    }))
  }
  // End delete deta ruta tipo carga

  // Register deta ruta producto
  registerDetaProducto(id, idRuta) { 
    let params = id + '/' + idRuta + '/' + this._userService.user.ID_USER;
    return this._http.post(this.URL + '/register/detarutaproducto/' + params, {}).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Producto registrado correctamente.', 'success');
      return res;
    }));
  }
  // End delete deta ruta producto

  // Get conductores
  getConductores(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/conductor/conductores/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get conductores
  
  // Get documentos conductores
  getDocConductores(search) {
    if (search === '') {
      search = '0'
    }
    return this._http.get(this.URL + '/register/documentosConductor/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos conductores

  // Get documentos conductores
  getDocConductoresCliente(search) {
    if (search === '') {
      search = '0'
    }
    return this._http.get(this.URL + '/register/documentosConductorCliente/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos conductores

  // Register documento conductor
  registerDocConductor(documento) { 
    let json = JSON.stringify(documento);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoConductor', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
      return res;
    }));
  }
  // End Register documento conductor

  // Update documento conductor
  updateDocConductor(documento) { 
    let json = JSON.stringify(documento);  
    let dataDocumento = json;  
    return this._http.put(this.URL + '/register/documentoConductor', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento modificado correctamente.', 'success');
      return res;
    }));
  }
  // End Update documento conductor
  
  // Delete documento conductor
  deleteDocConductor(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/documentoConductor/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete documento conductor
  
  // Get documentos unidad
  getDocUnidades(search) {
    if (search === '') {
      search = '0'
    }
    return this._http.get(this.URL + '/register/documentosUnidad/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos unidad

  // Get documentos unidad
  getDocUnidadesCliente(search) {
    if (search === '') {
      search = '0'
    }
    return this._http.get(this.URL + '/register/documentosUnidadCliente/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos unidad

  // Register documento unidad
  registerDocUnidad(documento) { 
    let json = JSON.stringify(documento);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoUnidad', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
      return res;
    }));
  }
  // End Register documento conductor

  // Update documento unidad
  updateDocUnidad(documento) { 
    let json = JSON.stringify(documento);  
    let dataDocumento = json;  
    return this._http.put(this.URL + '/register/documentoUnidad', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento modificado correctamente.', 'success');
      return res;
    }));
  }
  // End Update documento unidad
  
  // Delete documento unidad
  deleteDocUnidad(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/documentoUnidad/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete documento unidad
  
  // Get unidades
  getUnidades(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/operaciones/unidades/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get unidades

  // Get unidad
  getUnidad(placa) {
    return this._http.get(this.URL + '/operaciones/unidad/' + placa).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get unidad

  // Get unidades disponibles
  getUnidadesDisponibles(idTipo) {
    return this._http.get(this.URL + '/operaciones/unidadesDisponibles/' + idTipo).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get unidades disponibles
  
  // Get conductores disponibles
  getConductoresDisponibles() {
    return this._http.get(this.URL + '/operaciones/conductoresDisponibles').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get conductores disponibles

  // Register planificacion Op
  registerPlanifiacionOp(planifiacion) { 
    let json = JSON.stringify(planifiacion);  
    let data = json;  
    return this._http.post(this.URL + '/operaciones/planificacionOp', data).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Planificación registrada correctamente.', 'success');
      return res;
    }));
  }
  // End Register planificacion Op

  // Get orden servicio
  getOS(id) {
    return this._http.get(this.URL + '/operaciones/ordenServicio/' + id).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get orden servicio

  // Get planificacion OP
  getPlanificacionOP(id) {
    return this._http.get(this.URL + '/operaciones/planificacionOp/' + id).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get planificacion OP

  // Get planificacion deta
  getPlanificacionDeta(idPlanificacion) {
    return this._http.get(this.URL + '/operaciones/planificacionDeta/' + idPlanificacion).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get planificacion deta

  // Get planificaciones deta
  getPlanificacionesDeta(desde, hasta, idZona) {
    let paramas = desde + '/' + hasta + '/' + idZona;
    return this._http.get(this.URL + '/operaciones/planificacionesDeta/' + paramas).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get planificacion deta

  // Register planificacion Op deta
  registerPlanifiacionOpDeta(planifiacion) { 
    let json = JSON.stringify(planifiacion);  
    let data = json;  
    return this._http.post(this.URL + '/operaciones/planificacionOpDeta', data).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register planificacion Op deta

  // Get planificaciones op
  getPlanificacionesOp(search, desde, hasta) {
    if (search === '') {
      search = '0';
    }
    let params = search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/operaciones/planificacionesOp/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get planificaciones op
  
  // Delete planifiacion op
  deletePlanificacionOp(id, idOs) { 
    let params = id + '/' +  idOs + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/operaciones/planificacionOp/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete planificacion op
  
  // Delete planifiacion op deta
  deletePlanificacionOpDeta(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/operaciones/planificacionOpDeta/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete planificacion op deta

  // Get guia planificacion
  getGuiaPlanificacion(idOrden, idConductor) {
    let params = idOrden + '/' + idConductor;
    return this._http.get(this.URL + '/operaciones/guiaPlanificacion/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get guia planificacion
  
  // Update fechas planificacion guia
  updateFechaPlanificacionGuia(guia) { 
    let json = JSON.stringify(guia);  
    let dataGuia = json;  
    return this._http.put(this.URL + '/operaciones/planificacionOpGuia', dataGuia).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
      return res;
    }));
  }
  // End fechas planificacion guia

  // Get productividad conductores
  getProductividadConductor(desde: string,hasta: string, idZonaConductor: number, search: string ) {
    let params = `${desde}/${hasta}/${idZonaConductor}/${search}`;
    return this._http.get(this.URL + '/conductor/productividadComision/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get productividad conductores

  
  // Get productividad conductores-tracto
  getProductividadConductorTracto(desde: string,hasta: string, idZonaConductor: number, search: string ) {
    let params = `${desde}/${hasta}/${idZonaConductor}/${search}`;
    return this._http.get(this.URL + '/conductor/productividadConductorTractoComision/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get productividad conductores

  // Register - Update motivo no productividad conductor
  registerUpdateMotivoNoProdConductor(motivo) { 
    let json = JSON.stringify(motivo);  
    let dataMotivo = json;  
    return this._http.post(this.URL + '/conductor/motivoNoProductividadConductor', dataMotivo).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register - Update motivo no productividad conductor
  
  // Get productividad tractos
  getProductividadTracto(desde ,hasta) {
    let params = desde + '/' + hasta + '/1';
    return this._http.get(this.URL + '/operaciones/productividadTractoTarifa/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get productividad tractos
  
  // Register - Update motivo no productividad tracto
  registerUpdateMotivoNoTracto(motivo) { 
    let json = JSON.stringify(motivo);  
    let dataMotivo = json;  
    return this._http.post(this.URL + '/operaciones/motivoNoProductividadTracto', dataMotivo).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register - Update motivo no productividad tracto
  
  // Get excel guias diferencia peso
  getExcelGuiasDifPeso(search, desde, hasta) {
    if (search === '') {
      search = '0'
    }
    let params = search + '/' + desde + '/' + hasta;
    return this._http.get(this.URL + '/excel/viajesDiferenciaPesoTotal/' + params, {responseType: 'blob' }).pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel guias diferencia peso
  
  // Get excel guias diferencia peso
  getExcelRutas(search) {
    if (search === '') {
      search = '0'
    }
    let params = search;
    return this._http.get(this.URL + '/excel/rutas/' + params, {responseType: 'blob' }).pipe(map((res: any) => {     
      return res;
    }));
  }
  // End Get excel guias diferencia peso
  
  // Register tareo operaciones
  registerTareoOp(tareo) { 
    let json = JSON.stringify(tareo);  
    let dataTereo = json;  
    return this._http.post(this.URL + '/operaciones/tareoOperaciones', dataTereo).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register tareo operaciones
  
  // Get tareo operaciones
  getTareoOp(id) {
    return this._http.get(this.URL + '/operaciones/tareoOperaciones/' + id).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get tareo operaciones
  
  // Get motivos tareo operaciones
  getMotivosTareoOp() {
    return this._http.get(this.URL + '/operaciones/motivosTareoOperaciones').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get motivos tareo operaciones
  
  // Register deta tareo operaciones
  registerDetaTareoOp(detatareo) { 
    let json = JSON.stringify(detatareo);  
    let dataTereo = json;  
    return this._http.post(this.URL + '/operaciones/detaTareoOperaciones', dataTereo).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Register tareo operaciones
  
  // Update tareo operaciones
  updateDetaTareoOp(detaTareo) { 
    let json = JSON.stringify(detaTareo);  
    let dataTereo = json;  
    return this._http.put(this.URL + '/operaciones/detaTareoOperaciones', dataTereo).pipe(map((res: any) => {
      // Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Update tareo operaciones
  
  // Delete deta tareo operaciones
  deleteDetaTareoOp(idTareo, idConductor) { 
    let params = idTareo + '/' + idConductor + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/operaciones/detaTareoOperaciones/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
      return res;
    }));
  }
  // End delete deta tareo operaciones
  
  // Get tareos operaciones
  getTareosOp(search, desde, hasta,) {
    let params = search + '/' + desde + '/' + hasta ;
    return this._http.get(this.URL + '/operaciones/tareosOperaciones/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get tareos operaciones
  
  // Register deta tareo operaciones multiple
  registerDetaTareosOp(detaTareos) { 
    let json = JSON.stringify(detaTareos);  
    let dataTereos = json;  
    return this._http.post(this.URL + '/operaciones/detaTareosOperaciones', dataTereos).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro realizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register deta tareo operaciones
  
  // Delete tareo operaciones
  deleteTareoOp(idTareo) { 
    let params = idTareo + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/operaciones/tareoOperaciones/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro anulado correctamente.', 'success');
      return res;
    }));
  }
  // End delete tareo operaciones

  // Get rendimiento conductores
  getRendimientoConductores(desde: string, hasta: string) {
    let params = desde + '/' + hasta ;
    return this._http.get(this.URL + '/conductor/rendimientoConductores/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get rendimiento conductores

    // Get rendimiento conductor
    getRendimientoConductor(desde: string, hasta: string, dni: string) {
      let params = desde + '/' + hasta + '/' + dni;
      return this._http.get(this.URL + '/conductor/rendimientoConductor/' + params).pipe(map((res: any) => {
        return res;
      }));
    }
    // End Get rendimiento conductor
  
  // Get cliente
  getCliente(ruc) {
    return this._http.get(this.URL + '/register/cliente/' + ruc).pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get cliente

  // Get dias feriados
  getDiasFeriados() {
    return this._http.get(this.URL + '/register/diasferiado').pipe(map((res: any) => {
      return res;
    }));
  }
  // End Get dias feriados
  
  // Get agenda telefonica
  getAgendaTelefonica(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/user/agendatelefonica/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get agenda telefonica
  
  // Get clasificacion documentos
  getClasificacionDocBriane() {
    return this._http.get(this.URL + '/register/clasificaciondocbriane').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get clasificacion documentos
  
  // Get categoria documentos
  getCategoriaDocBriane(idClasificacion) {
    return this._http.get(this.URL + '/register/categoriadocbriane/' + idClasificacion).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get categoria documentos
  
  // Get areas documentos
  getAreasBriane() {
    return this._http.get(this.URL + '/register/areasbriane').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get areas documentos
  
  // Get documentos BRIANE
  getDocumentosBriane(idClasificacion, idCategoria, idArea) {
    let params = idClasificacion + '/' + idCategoria + '/' + idArea;
    return this._http.get(this.URL + '/register/documentosbriane/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos BRIANE
  
  // Get empleados rrhh genesys
  getEmpleadosRhhGenesys(desde, hasta) {
    let params = desde + '/' + hasta;
    return this._http.get(this.URL + '/register/empleadosrrhhgenesys/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get empleados rrhh genesys
  
  // Get empleados rrhh genesys bajas
  getEmpleadosRhhGenesysBajas(desde, hasta) {
    let params = desde + '/' + hasta;
    return this._http.get(this.URL + '/register/empleadosrrhhgenesysbajas/' + params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get empleados rrhh genesys bajas
  
  // Get clientes-proveedores
  getClientes() {
    return this._http.get(this.URL + '/register/clientes').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get clientes-proveedores
  
  // Get monedas
  getMonedas() {
    return this._http.get(this.URL + '/register/monedas').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get monedas
  
  // Get tipo cobros ordenes servicios
  getTipoCobrosOs() {
    return this._http.get(this.URL + '/register/tipocobrosos').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get tipo cobros ordenes servicios
  
  // Register documento cliente
  registerDocCliente(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoCliente', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
      return res;
    }));
  }
  // End Register documento cliente
  
  // Get documentos cliente conductor
  getDocClientes(idCliente) {
    return this._http.get(this.URL + '/register/documentosCliente/' + idCliente).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos cliente conductor

  // Delete documento cliente conductor
  deleteDocCliente(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/documentoCliente/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete documento cliente conductor 
  
  // Register relacion documento conductor
  registerDocConductorRelacion(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoConductorRelacion', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register relacion documento conductor
  
  // Get relacion documentos conductor total
  getDocConductorTotal(idCliente, idConductor) {
    return this._http.get(this.URL + '/register/documentosConductorTotal/' + idCliente + '/' + idConductor).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get relacion documentos conductor total
  
  // Update relacion documento conductor
  updateDocCondcutor(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.put(this.URL + '/register/documentoConductorRelacion', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
      return res;
    }));
  }
  // End Update relacion documento conductor

  // Register documento cliente unidad
  registerDocClienteUnidad(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoClienteUnidad', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento registrado correctamente.', 'success');
      return res;
    }));
  }
  // End Register documento cliente
  
  // Get documentos cliente unidad
  getDocClientesUnidad(idCliente) {
    return this._http.get(this.URL + '/register/documentosClienteUnidad/' + idCliente).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get documentos cliente unidad
  
  // Delete documento cliente unidad
  deleteDocClienteUnidad(id) { 
    let params = id + '/' + this._userService.user.ID_USER;
    return this._http.delete(this.URL + '/register/documentoClienteUnidad/' + params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Documento anulado correctamente.', 'success');
      return res;
    }));
  }
  // End Delete documento cliente conductor
  
  // Get relacion documentos unidad total
  getDocUnidadTotal(idCliente, idUnidad) {
    return this._http.get(this.URL + '/register/documentosUnidadTotal/' + idCliente + '/' + idUnidad).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get relacion documentos conductor total
  
  // Register relacion documento unidad
  registerDocUnidadRelacion(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.post(this.URL + '/register/documentoUnidadRelacion', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
      return res;
    }));
  }
  // End Register relacion documento unidad
  
  // Update relacion documento unidad
  updateRelacionDocUnidad(data) { 
    let json = JSON.stringify(data);  
    let dataDocumento = json;  
    return this._http.put(this.URL + '/register/documentoUnidadRelacion', dataDocumento).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Registro actualizado correctamente.', 'success');
      return res;
    }));
  }
  // End Update relacion documento conductor

  // Metodo para exportar a excel documentos de unidad
  getExelDocumentosUnidad() {
    return this._http.get(this.URL + '/excel/documentosUnidad', {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar a excel documentos de unidad

  // Get tipo documentos conductor
  getTipoDocumentosConductor() {
    return this._http.get(this.URL + '/register/tipoDocumentosConductor').pipe(map((res: any) => {
      return res;
    }))
  }
  // Fin Get tipo documentos conductor
  
  
  // Get tipo documentos unidad
  getTipoDocumentosUnidad() {
    return this._http.get(this.URL + '/register/tipoDocumentosUnidad').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get tipo documentos unidad
  
  // Get cantidad dias tramite documentos unidad-conductor
  getDiasTramiteUnidadCond() {
    return this._http.get(this.URL + '/register/cantidadDiasTramiteDocumentos').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get cantidad dias tramite documentos unidad-conductor
  
  // Get cantidad dias tramite documentos unidad-conductor
  getConceptosGatosOp() {
    return this._http.get(this.URL + '/register/conceptosGatosOp').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get cantidad dias tramite documentos unidad-conductor
  
  // Get relacion documentos conductor total
  getMeses() {
    return this._http.get(this.URL + '/register/meses').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get relacion documentos conductor total

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // APIS EXTERNAS
  
  // Get marcajes sistema Qwantec
  marcajesQwantec(data) {
    let json = JSON.stringify(data);  
    let params = json;  
    return this._http.post('https://app.relojcontrol.com/api/consultaMarcaciones/consulta',params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Get marcajes sistema Qwantec
  
  // Altas, bajas y actualizacion de empleados 
  sincronizarEmpleadosQwantec(data) {
    let json = JSON.stringify(data);  
    let params = json;  
    return this._http.post('https://app.relojcontrol.com/api/actualizarEmpleados/importar',params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Altas, bajas y actualizacion de empleados 
  
  // APIS EXTERNAS
  ///////////////////////////////////////////////////////////////////////////////////////////////

}