import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { CompanyUser } from '../../models/companyUser.model';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { AddressCompany } from '../../models/addressCompany.model';
// import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styles: []
})
export class AddcompanyComponent implements OnInit {

  public companyUser: CompanyUser;
  public imageUpload: File;
  public tempImage: string;
  public google: boolean;
  public ID_COMPANY_USER: number;
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];
  public addressCompany: AddressCompany;
  public addressCompanys: any[] = [];
  public idDepartamento = '';
  public idProvincia = '';
  public idDistrito = '';
  public rucSunat = '';
  public loading;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _router: Router

  ) {
    this.loading = true;
    this.google = false;
    this.companyUser = new CompanyUser('', 0, '', '');
    this.addressCompany = new AddressCompany(0, '', '', 0, false);
  }

  ngOnInit() {
    this.getDepartamentos();
    this._route.params.forEach((params: Params) => {
      this.ID_COMPANY_USER = params.id;
      if (this.ID_COMPANY_USER > 0) {
        this.getCompany();
        this.getsAddress();
      }
    });

  }

  // Buscar ruc sunat
  getRucSunat(ruc: string) {
    ruc = ruc.trim();
    if (ruc.length !== 11) {
      Swal.fire('Mensaje', 'Debe ingresar un numero de RUC valido', 'warning');
      return;
    }

    if (ruc === '') {
      Swal.fire('Mensaje', 'Debe ingresar un numero de RUC.', 'warning');
    } else {
      this.loading = false;
      this._userService.getRucSunat(ruc).subscribe(
        (response: any) => {
          if (response.RUC) {
            this.companyUser.ID_COMPANY = response.RUC;
            this.companyUser.DS_COMPANY = response.RAZON_SOCIAL;
            this.addressCompany.ADDRESS = response.DIRECCION;

            this.idDepartamento = response.ID_DEPARTAMENTO;
            this.getProvincias(response.ID_DEPARTAMENTO);
            this.idProvincia = response.ID_PROVINCIA;
            this.getDistritos(response.ID_PROVINCIA);
            this.idDistrito = response.ID_DISTRITO;

            this.loading = true;
          } else {
            Swal.fire('Mensaje', response.message, 'warning');
            this.loading = true;
          }
        }
      );
    }
  }

  // Buscar una empresa
  getCompany() {
    this._userService.getCompany(this.ID_COMPANY_USER).subscribe(
      (response: any) => {
          this.companyUser = response;
      }
    );
  }

  // Actualizar empresa
  updateCompany(companyUser) {
    this.companyUser = companyUser;
    this.companyUser.ID_COMPANY_USER = this.ID_COMPANY_USER;
    // console.log( this.companyUser);
    this._userService.updateCompany(companyUser).subscribe(
      (response: any) => {
      }
    );
  }

  // Registrar empresa
  saveCompany(companyUser) {
    // tslint:disable-next-line: prefer-const
    let ruc = companyUser.ID_COMPANY.trim();
    if (ruc.length !== 11) {
      Swal.fire('Mensaje', 'Debe ingresar un numero de RUC valido', 'warning');
      return;
    }
    this.companyUser = companyUser;
    this.companyUser.ID_USER = this._userService.user.ID_USER;

    this._userService.registerCompany(companyUser).subscribe(
      (response: any) => {
        this.addressCompany.DS_ADDRESS_COMPANY = 'Principal';
        this.ID_COMPANY_USER = response.company.ID_COMPANY_USER;
        this.saveAddress(companyUser, true);
        this.getDepartamentos();
        this._router.navigate(['/company', response.company.ID_COMPANY_USER]);
      }
    );
  }

  // Guardar sucursal
  saveAddress(address, principal: boolean) {
    if (address.DS_ADDRESS_COMPAN === undefined) {
      this.addressCompany.DS_ADDRESS_COMPANY = 'Principal';
    } else {
      this.addressCompany.DS_ADDRESS_COMPANY = address.DS_ADDRESS_COMPANY;
    }
    this.addressCompany.FG_PRINCIPAL = principal;
    this.addressCompany.ADDRESS = address.ADDRESS;
    this.addressCompany.ID_DISTRITO = address.idDistrito;
    this.addressCompany.ID_COMPANY_USER = this.ID_COMPANY_USER;
    this._userService.registerAddress(this.addressCompany, principal).subscribe(
      (response: any) => {
        // console.log(response);
        this.cancelAddress();
        this.getsAddress();
      }
    );
  }

  // Borrar empresa
  deleteCompany() {
    // console.log(id);
    this._userService.deleteCompany(this.ID_COMPANY_USER).subscribe(
      (response: any) => {
        this._router.navigate(['/companys']);
      }
    );
  }

  // Listar departamentos
  getDepartamentos() {
    this._userService.getDepartamentos().subscribe(
      (response: any) => {
        this.departamentos = Object.values(response);
        this.departamentos =  this.departamentos[0];
      }
    );
  }

  // Listar provincias
  getProvincias(departamento) {
    this.distritos = [];
    this.idDistrito = '';
    this.idProvincia = '';
    if (departamento > 0) {
      this._userService.getProvincias(departamento).subscribe(
        (response: any) => {
          this.provincias = Object.values(response);
          this.provincias =  this.provincias[0];
        }
       );
    } else {
      this.provincias = [];
      this.idProvincia = '';
    }
  }

  // Listar distritos
  getDistritos(provincia) {
    this.idDistrito = '';
    if (provincia > 0) {
      this._userService.getDistritos(provincia).subscribe(
        (response: any) => {
          // console.log(response);
          this.distritos = Object.values(response);
          this.distritos =  this.distritos[0];
        }
       );
    } else {
      return;
    }
  }

  // Cancelar registro de direccion
  cancelAddress() {
    this.provincias = [];
    this.distritos = [];
    this.idDepartamento = '';
    this.idProvincia = '';
    this.idDistrito = '';
    this.addressCompany = new AddressCompany(0, '', '', 0, false, 0);
  }

  // Listar direcciones
  getsAddress() {
    this._userService.getsAddress(this.ID_COMPANY_USER).subscribe(
      (response: any) => {
        this.addressCompanys = Object.values(response);
        this.addressCompanys = this.addressCompanys[0];
      }
    );
  }

  defaultAddressCompany(addressCompany, idAddress) {
    this._userService.defaultAddressCompany(addressCompany, idAddress).subscribe(
      (response: any) => {
        this.getsAddress();
      }
    );
  }

  // Borrar Direccion
  deleteAddress(idAddress: number) {
    this._userService.deleteAddress(idAddress).subscribe(
      (response: any) => {
        this.getsAddress();
      }
    );
  }

  // Seleccionar imagen de empresa
  selectImage(file: File) {
    if (!file) {
      this.imageUpload = null;
      return;
    } else {
      if (file.type.indexOf('image') < 0) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }
      this.imageUpload = file;
      // tslint:disable-next-line: prefer-const
      let reader = new FileReader();
      // tslint:disable-next-line: prefer-const
      let urlImageTemp = reader.readAsDataURL(file);
      // console.log(this.imageUpload);
      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  // Cambiar imagen de empresa
  changeImage() {
    this._userService.changeImageCompany(this.imageUpload, this.ID_COMPANY_USER);
  }


}
