import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from '../../models/user.model';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UploadFileService } from '../uploadFile/upload-file.service';
import { CompanyUser } from '../../models/companyUser.model';
import { AddressCompany } from '../../models/addressCompany.model';
import { Module } from '../../models/module.model';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public URL = environment.URL_SERVICES;
  public user: User;
  public token: string;
  public menu: any = [];
  public menus: any = [];
  public idRole: number;
  public modules: any = [];
  public ID_MODULE = '';
  public report;

  constructor(
    public _http: HttpClient,    
    public _router: Router,    
    public _uploadFileService: UploadFileService
  ) {
      this.report = 0;
      this.loadStorage();
   }

  loadReport() {
    this.report = 1;
    localStorage.setItem('report', this.report.toString());
  }

  closeReport() {
    this.report = 0;
    localStorage.setItem('report', this.report.toString());
  }

  idModule(ID_MODULE) {
    this.ID_MODULE = ID_MODULE;
    localStorage.setItem('idModule', this.ID_MODULE);
  }

  loadIdmodule() {
    if (localStorage.getItem('token')) {
      this.ID_MODULE = (localStorage.getItem('idModule'));
    }
  }

  // Validar token
  validarToken() {
    let token = this.token;   
    let payload = JSON.parse( atob(token.split('.')[1]));
    let expired = this.veryfyTokenVen(payload.exp);
    if (expired) {
      Swal.fire('Mensaje', 'La sesión ha caducado.', 'warning');
      this.logout();
      return false;
    }
    return this.veryfyTokenRenew(payload.exp);
  }
  
  // Verificar fecha de vencimiento de token
  veryfyTokenVen(dateTokenExp: number) {
    let timeNow = new Date().getTime() / 1000;
    if (dateTokenExp < timeNow) {
      return true;
    } else {
      return false;
    }
  }

  // Verificar si hay que renovar token
  veryfyTokenRenew(dateTokenExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date( dateTokenExp * 1000);
      let nowDate = new Date();
      nowDate.setTime(nowDate.getTime() + (1 * 60 * 60 * 1000));
      if ( tokenExp.getTime() > nowDate.getTime() ) {
        resolve(true);
      } else {
        this.renewToken().subscribe(
          () => {
            resolve(true);
          }, () => {
            this.logout();
            reject(false);
          }
        );
      }
    });
  }

  // Renovar token
  renewToken() {   
    return this._http.get(this.URL + '/login/renewtoken').pipe(map( (res: any) => {
       this.token = res.token;
       localStorage.setItem('token', this.token);
       console.log('Token renew');
       return true;
     }))
     .pipe(catchError( (err: any) => {
       Swal.fire('Mensaje', 'No se puedo renovar el Token de Seguridad', 'error');
       return throwError(err);
     }));
  }
  // Fin de Renovar token

  //Permiso a modulo
  permisoModule(url){    
    let menu = localStorage.getItem('menu');
    if (menu.indexOf(url) < 0 && this.user.ID_ROLE != 1) {
      Swal.fire('Mensaje', 'No tiene permiso para ingresar a este modulo.', 'warning');
      this._router.navigate(['/home']);
    } 
  }
  // Fin Permiso a modulo

  // Registrar un Usuario
  userRegister(user: User) {
    return this._http.post(this.URL + '/user', user).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Usuario Registrado Correctamente', 'success');
      return res.user;
    }));
  }
  // Fin de Registrar un Usuario

  // Actualizar perfil de usuario
  updateProfile(user: User) {
   let json = JSON.stringify(user);
   let params = json;
   return this._http.put(this.URL + '/user/' + user.ID_USER, params).pipe(map((res: any) => {
     if (user.ID_USER === this.user.ID_USER) {
       this.saveLocalStorage(res.user.ID_USER, this.token, res.user, this.menu);
     }
     Swal.fire('Mensaje', 'Datos Actualizados Correctamente', 'success');
     return true;
   }));
  }
  // Fin Actualizar perfil de usuario

  // Actualizar constraseña de usuario
  updatePassword(user: User) {   
    let json = JSON.stringify(user);    
    let params = json;
    return this._http.put(this.URL + '/user/password/' + user.ID_USER, params).pipe(map((res: any) => {
      if (user.ID_USER === this.user.ID_USER) {
        this.saveLocalStorage(res.user.ID_USER, this.token, res.user, this.menu);
      }
      Swal.fire('Mensaje', 'Contraseña Actualizada Correctamente', 'success');
      return true;
    }));
   }
   // Fin Actualizar constraseña de usuario

   // Actualizar constraseña de usuario con admin
  updatePasswordAdmin(user: User) {   
    let json = JSON.stringify(user);   
    let params = json;
    return this._http.put(this.URL + '/user/updatepassword/' + user.ID_USER, params).pipe(map((res: any) => {
      if (user.ID_USER === this.user.ID_USER) {
        this.saveLocalStorage(res.user.ID_USER, this.token, res.user, this.menu);
      }
      Swal.fire('Mensaje', 'Contraseña Actualizada Correctamente', 'success');
      return true;
    }));
   }
   // Fin Actualizar constraseña de usuario con admin

  // Cambiar imagen de perfil de usuario
  changeImage(file: File, id: number) {
   this._uploadFileService.uploadFile(file, 'user', id, this.user.ID_USER)
       .then( (resp: any) => {
         this.user.IMAGE = resp.user.IMAGE;
         this.saveLocalStorage(id, this.token, this.user, this.menu);
         Swal.fire('Mensaje', 'Imagen Actualizada Correctamente', 'success');
       })
       .catch( resp => {
         Swal.fire('Error', 'No se pudo subir la imagen', 'warning');
       });
  }
  // Fin Cambiar imagen de perfil de usuario

  // Metodo para listar usuarios
  getUsers(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/user/users/' + search).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar usuarios

  // Metodo para listar usuarios
  getUser(idUser) {
    return this._http.get(this.URL + '/user/' + idUser).pipe(map((res: any) => {
      return res.user;
    }))
    .pipe(catchError( (err: any) => {
      if (err.status === 400) {
        Swal.fire('Mensaje', err.error.message, 'error');
        this._router.navigate(['/users']);
        return throwError(err);
      } else {
        Swal.fire('Mensaje', 'No se pudo consultar el usuario.', 'error');
        this._router.navigate(['/users']);
        return throwError(err);
      }
    }));
  }
  // Fin Metodo para listar usuarios

  // Metodo para buscar usuario
  searchUser(termino: string) {
    return this._http.get(this.URL + '/search/collection/users/' + termino).pipe(map((res: any) => {
      return res.users;
    }));
  }
  // Fin de Metodo para buscar usuario

  // Borrar Usuario
  deleteUser(id: number) {
   return this._http.delete(this.URL + '/user/' + id,).pipe(map((res: any) => {
     Swal.fire('Mensaje', 'Usuario eliminado correctamente.', 'success');
     return res;
   }));
  }
  // Fin de Borrar Usuario

  isLoged() {
    return (this.token.length > 5) ? true : false;
  }

  searchUsers(search: string) {
    return this._http.get(this.URL + '/search/users/' + search)
    .pipe(map((res: any) => {
      return res.users;
    }));
  }

  // Mostrar foto de genesys
  getDatosAgenda(dni: string) {
    return this._http.get(this.URL + '/user/datosAgenda/' + dni)
    .pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Mostrar foto de genesys

  // Login Normal
  login(user: User, remenberme: boolean = false) {
    if (remenberme) {
      localStorage.setItem('email', user.EMAIL);
    } else {
      localStorage.removeItem('email');
    }
    return this._http.post(this.URL + '/login', user).pipe(map((res: any) => {
      this.saveLocalStorage(res.id, res.token, res.user, res.menu);
      localStorage.setItem('idModule', this.ID_MODULE.toString());
      localStorage.setItem('report', this.report.toString());
      return true;
    }));  
  }
  // Fin de Login Normal

  // Login Google
  loginGoogle(token: string) {
    return this._http.post(this.URL + '/login/google', { token }).pipe(map((res: any) => {
    this.saveLocalStorage(res.id, res.token, res.user, res.menu);
      localStorage.setItem('idModule', this.ID_MODULE.toString());
      localStorage.setItem('report', this.report.toString());
       return true;
    }));
  }
  // Fin de Login Google

  // Gets modules
  getModules(idRole) {
  return this._http.get(this.URL + '/user/modules/' + idRole).pipe(map((res: any) => {
    this.modules = res;
    return this.modules;
    }));
  }

  // Gets menu
  getMenu(idRole) {
    return this._http.get(this.URL + '/user/menu/' + idRole).pipe(map((res: any) => {
      this.menus = res;
      return this.menus;
      }));
  }
  // Fin de Gets menu

  // Cerrar Sesion
  logout() {
    this.user = null;
    this.token = '';
    this.menu = [];
    this.idRole = 0;
    this.report = 0;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');
    localStorage.removeItem('idRole');
    localStorage.removeItem('report');
    localStorage.removeItem('idModule');
    this._router.navigate(['/login']);
  }
  // Fin de Cerrar Sesion

  // Metodo para guardad datos en localstorage
  saveLocalStorage(id: number, token: string, user: User, menu: any) {
     localStorage.setItem('id', id.toString());
     localStorage.setItem('token', token);
     localStorage.setItem('user', JSON.stringify(user));
     localStorage.setItem('menu', JSON.stringify(menu));
     this.user = user;
     this.token = token;
     this.menu = menu;
  }
  // Fin deb Metodo para guardad datos en localstorage

  // Cargar los datos del localStorage
  loadStorage() {
    if (localStorage.getItem('token') && localStorage.getItem('menu')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
      this.idRole = parseInt(localStorage.getItem('idRole'));
      this.report = parseInt(localStorage.getItem('report'));
    } else {
     this.logout()
    }
  }
  // Fin Cargar los datos del localStorage

  // Metodo para consultar ruc
  getRucSunat(ruc: string) {
    return this._http.get(this.URL + '/sunat/consultaruc/' + ruc).pipe(map((res: any) => {
      return res;
    }))
    .pipe(catchError( (err: any) => {
        Swal.fire('Mensaje', 'No se pudo hacer la consulta.', 'error');
        this._router.navigate(['/companys']);
        return throwError(err);
    }));
  }
  // Fin de Metodo para consultar ruc

  // Cambiar imagen de empresa
  changeImageCompany(file: File, id: number) {
    this._uploadFileService.uploadFile(file, 'company', id, this.user.ID_USER).then( (resp: any) => {
      Swal.fire('Mensaje', 'Imagen Actualizada Correctamente', 'success');
    })
    .catch( resp => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'warning');
    });
  }
  // Fin Cambiar imagen de empresa

  // Registrar empresa
  registerCompany(company: CompanyUser) {
    let json = JSON.stringify(company);
    let params = json;
    return this._http.post(this.URL + '/user/company', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Empresa Registrada Correctamente.', 'success');
      return res;
    }));
  }
  // Fin de Registrar empresa

  // Actualizar empresa
  updateCompany(company: CompanyUser) {
    let json = JSON.stringify(company);
    let params = json;
    return this._http.put(this.URL + '/user/company/' + company.ID_COMPANY_USER + '/' + this.user.ID_USER, params)
    .pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Empresa Actualizada Correctamente', 'success');
      return true;
    }))
      .pipe(catchError( (err: any) => {
      if (err.status === 400) {
        Swal.fire('Mensaje', err.error.message, 'error');
        return throwError(err);
      } else {
        Swal.fire('Mensaje', 'No se Pudo Actualizar los datos de la empresa.', 'error');
        return throwError(err);
      }
    }));
  }
  // Fin de Actualizar empresa

  // Borrar Empresa
   deleteCompany(id: number) {
    return this._http.delete(this.URL + '/user/company/' + id).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Empresa Eliminada Correctamente.', 'success');
      return true;
    }));
  }
  // Fin de Borrar empresa

  // Metodo para buscar una empresa
  getCompany(ID_EMPRE_USER) {
    return this._http.get(this.URL + '/user/company/' + ID_EMPRE_USER + '/' + this.user.ID_USER).pipe(map((res: any) => {
      return res.company;
    }))
    .pipe(catchError( (err: any) => {
      if (err.status === 400) {
        Swal.fire('Mensaje', err.error.message, 'error');
        this._router.navigate(['/companys']);
        return throwError(err);
      } else {
        Swal.fire('Mensaje', 'No se pudo consultar la empresa.', 'error');
        this._router.navigate(['/companys']);
        return throwError(err);
      }
    }));
  }
  // Fin de Metodo para buscar una empresa

  // Metodo para listar empresas
  getCompanys(ID_USER, search) {
    if (search === '') {
      search = '0';
    }
    let params = {'search': search};
    return this._http.post(this.URL + '/user/companys/' + ID_USER, params).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin de Metodo para listar empresas

  // Metodo para listar Departamentos
  getDepartamentos() {
    return this._http.get(this.URL + '/address/departamentos').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin de Metodo para listar Departamentos

  // Metodo para listar provincias
  getProvincias(departamento: number) {
    return this._http.get(this.URL + '/address/provincias/' + departamento).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin de Metodo para listar provincias

  // Metodo para listar distritos
  getDistritos(provincia: number) {
    return this._http.get(this.URL + '/address/distritos/' + provincia).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin de Metodo para listar distritos

  // Registrar Sucursal
  registerAddress(addressCompany: AddressCompany, principal: boolean) {
    let json = JSON.stringify(addressCompany);
    let params = json;
    return this._http.post(this.URL + '/address', params).pipe(map((res: any) => {
      if (!principal) {
        Swal.fire('Mensaje', 'Sucursal registrada correctamente.', 'success');
      }
      return res;
    }));
  }
  // Fin de Registrar empresa

  // Metodo para listar Sucursales
  getsAddress(idCompanyUser: number) {
    return this._http.get(this.URL + '/address/' + idCompanyUser).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin de Metodo para listar Sucursales

   // Metodo para mostrar una Sucursal
   getAddress(idAddress: number, idUser) {
    return this._http.get(this.URL + '/address/' + idAddress + '/' + idUser).pipe(map((res: any) => {
      if (res.address) {
        return res.address;
      } else {
        Swal.fire('Mensaje', 'Sucursal no Registrada.', 'warning');
        return 0;
      }
    }));
  }
  // Fin de Metodo para mostrar una Sucursal

  // Actualizar Sucursal
  UpdateAddress(addressCompany: AddressCompany, idAddress: number) {
    let json = JSON.stringify(addressCompany);
    let params = json;
    return this._http.put(this.URL + '/address/update/' + idAddress, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Sucursal Actualizada correctamente.', 'success');
      return res;
    }));
  }
  // Fin de Actualizar Sucursal

  // Establecer direccion principal de empresa
  defaultAddressCompany(addressCompany: AddressCompany, idAddress: number) {
    let json = JSON.stringify(addressCompany);
    let params = json;
    return this._http.put(this.URL + '/address/defaultaddress/' + idAddress, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Sucursal principal establecida correctamente.', 'success');
      return res;
    }));
  }
  // Fin de Establecer direccion principal de empresa

  // Borrar sucursal
  deleteAddress(id: number) {
    return this._http.delete(this.URL + '/address/' + id).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Sucursal Eliminada Correctamente.', 'success');
      return true;
    }));
  }
  // Fin de Borrar sucursal

  // Registrar Modulos
  registerModule(modules: Module) {
    let json = JSON.stringify(modules);
    let params = json;
    return this._http.post(this.URL + '/security/module', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Modulo registrado correctamente.', 'success');
      return res;
    }));
  }
  // Fin de Registrar empresa

  // Metodo para listar tipo de menu
  getsTmenu() {
    return this._http.get(this.URL + '/security/tmenu').pipe(map((res: any) => {
      return res;
    }));
  }
  // fin Metodo para listar tipo de menu

  // Metodo para listar los modulos principales
  getsPmodules() {
    return this._http.get(this.URL + '/security/pmodules').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar los modulos principales

  // Metodo para listar los modulos secundarios
  getsSmodules() {
    return this._http.get(this.URL + '/security/smodules').pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar los modulos secundarios

  // Metodo para listar todos los modulos
  getsModules(idTypeMenu) {
    return this._http.get(this.URL + '/security/modules/' + idTypeMenu).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar todos los modulos

  // Metodo para listar todos los modulos por rol
  getsModulesRol(idTypeMenu, idRole) {
    return this._http.get(this.URL + '/security/modulesroles/' + idTypeMenu + '/' + idRole).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar los modulos por rol

  // Metodo para listar todos los modulos por rol
  getsRolModules(idRole) {
    return this._http.get(this.URL + '/security/rolmodules/' + idRole).pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para listar los modulos por rol

  // Metodo para buscar un modulo
  getModule(idModule) {
    return this._http.get(this.URL + '/security/module/' + idModule).pipe(map((res: any) => {
      return res.module;
    }));
  }
  // Fin Metodo para listar los modulos secundarios

  // Metodo eliminar un modulo
  deleteModule(idModule) {
    return this._http.delete(this.URL + '/security/module/' + idModule).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Modulo Eliminado Correctamente.', 'success');
      return true;
    }));
  }
  // Fin Metodo eliminar un modulo

  // Metodo para mover un modulo
  moveModule(module: Module, move: number) {
    let json = JSON.stringify(module);
    let params = json;
    return this._http.put(this.URL + '/security/movemodule/' + move, params).pipe(map((res: any) => {
      return res;
    }));
  }
  // FinMetodo para mover un modulo

  // Metodo actualizar modulo
  updateModule(module: Module) {
    let json = JSON.stringify(module);
    let params = json;
    return this._http.put(this.URL + '/security/module/' + module.ID_MODULE, params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Modulo Actualizado correctamente.', 'success');
      return res;
    }));
  }
  // Fin Metodo actualizar modulo

  // Metodo actualizar roels module
  updateRolesModules(modules) {
    let json = JSON.stringify(modules);
    let params = json;
    return this._http.put(this.URL + '/security/rolesuser', params).pipe(map((res: any) => {
      return true;
    }));
  }
  // Fin Metodo actualizar modulo

   // Metodo registrar rol de usuario
   registerRole(dsRole) {
    let json = JSON.stringify(dsRole);
    let params = json;
    return this._http.post(this.URL + '/security/role', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Rol de usuario registrado correctamente.', 'success');
      return res;
    }));
  }
  // Fin Metodo registrar rol de usuario

  // Metodo para listar roles de usuario
  getRoles() {
    return this._http.get(this.URL + '/security/roles').pipe(map((res: any) => {
      return res.roles;
    }));
  }
  // Fin Metodo para listar roles de usuario

  // Metodo para listar roles de usuario no administrador
  getRolesUser() {
    return this._http.get(this.URL + '/security/rolesuser').pipe(map((res: any) => {
      return res.roles;
    }));
  }
  // Fin Metodo para listar roles de usuario no administrador

  // Metodo actualizar rol de usuario
  updateRole(role) {
    let json = JSON.stringify(role);
    let params = json;
    return this._http.put(this.URL + '/security/role', params).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Rol de usuario actualizado correctamente.', 'success');
      return res;
    }));
  }
  // Fin Metodo actualizar rol de usuario

   // Metodo eliminar rol de usuario
   deleteRole(role) {
    return this._http.delete(this.URL + '/security/role/' + role.ID_ROLE).pipe(map((res: any) => {
      Swal.fire('Mensaje', 'Rol de usuario eliminado correctamente.', 'success');
      return res;
    }));
  }
  // Fin Metodo eliminar rol de usuario

  // Metodo para exportar a excel listado de empresas
  getCompanysExcel(search) {
    if (search === '') {
      search = '0';
    }    
    return this._http.get(this.URL + '/excel/companys/' + this.user.ID_USER + '/' + search, {responseType: 'blob'}).pipe(map((res: any) => {     
      return res;
    }));
  }
  // Fin Metodo para exportar empresas

  // Metodo para exportar a excel listado usuarios
  getUsersExcel(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/excel/users/' + search,  {responseType: 'blob'}).pipe(map((res: any) => {      
      return res;
    }));
  }
  // Fin Metodo para exportar a excel listado usuarios

  // Metodo para exportar a excel listado de empresas
  getClientsExcel(search) {
    if (search === '') {
      search = '0';
    }
    return this._http.get(this.URL + '/excel/clients/' + this.user.ID_USER + '/' + search, {responseType: 'blob'})
    .pipe(map((res: any) => {
      return res;
    }));
  }
  // Fin Metodo para exportar empresas

}