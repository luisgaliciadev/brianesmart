import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AddressCompany } from '../../models/addressCompany.model';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  styles: []
})
export class UpdateAddressComponent implements OnInit {

  public ID_COMPANY_USER: number;
  public ID_ADDRESS_COMPANY: number;
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];
  public addressCompany: AddressCompany;  
  public idDepartamento = '';
  public idProvincia = '';
  public idDistrito = '';

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _router: Router
  ) {
     this.addressCompany = new AddressCompany(0, '', '', 0, false);     
  }

  ngOnInit() {
    // console.log('ID_COMPANY_USER1:' +  + this.ID_COMPANY_USER1);

    this._route.params.forEach((params: Params) => {
      this.ID_ADDRESS_COMPANY = params.id;
      if (this.ID_ADDRESS_COMPANY > 0) {
        this.getAddress();
        this.getDepartamentos();
      }
    });
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
          this.distritos = Object.values(response);
          this.distritos =  this.distritos[0];
        }
       );
    } else {
      return;
    }
  }

  // Consultar datos de sucursal
  getAddress() {
    this._userService.getAddress(this.ID_ADDRESS_COMPANY, this._userService.user.ID_USER).subscribe(
      (response: any) => {
        if (response === 0) {
          console.log(response);
          this._router.navigate(['/companys']);
        } else {
          this.addressCompany = response;
          this.ID_ADDRESS_COMPANY = this.addressCompany.ID_ADDRESS_COMPANY;
          this.ID_COMPANY_USER = this.addressCompany.ID_COMPANY_USER;
          this.idDepartamento = this.addressCompany.ID_DEPARTAMENTO.toString();
          this.getProvincias(this.idDepartamento);
          this.idProvincia =  this.addressCompany.ID_PROVINCIA.toString();
          this.getDistritos(this.idProvincia);
          this.idDistrito = this.addressCompany.ID_DISTRITO.toString();
        }
      }
    );
  }

  // Actualizar datos de sucursal
  updateAddress(address) {
    this._userService.UpdateAddress(address, this.ID_ADDRESS_COMPANY).subscribe(
      (response: any) => {
        this.getDepartamentos();
        this.getAddress();
      }
    );
  }

  // Borrar sucursal
  deleteAddress() {
    this._userService.deleteAddress(this.ID_ADDRESS_COMPANY).subscribe(
      (response: any) => {
        this._router.navigate(['/company', this.ID_COMPANY_USER]);
      }
    );
  }

}


