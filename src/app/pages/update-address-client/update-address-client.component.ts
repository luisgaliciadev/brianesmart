import { Component, OnInit } from '@angular/core';
import { AddressClient } from '../../models/addressClient.model';
import { UserService } from 'src/app/services/service.index';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-update-address-client',
  templateUrl: './update-address-client.component.html',
  styles: []
})
export class UpdateAddressClientComponent implements OnInit {

  public ID_CLIENT: number;
  public ID_ADDRESS_CLIENT: number;
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];
  public addressClient: AddressClient;  
  public idDepartamento = '';
  public idProvincia = '';
  public idDistrito = '';

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _router: Router,
    // tslint:disable-next-line: variable-name
    public _registerService: RegisterService
  ) {
     this.addressClient = new AddressClient(0, '', '', 0, false);
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.ID_ADDRESS_CLIENT = params.id;
      if (this.ID_ADDRESS_CLIENT > 0) {
        this.getAddressClient();
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
          // console.log(response);
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

  // Consultar datos de sucursal
  getAddressClient() {
    this._registerService.getAddressClient(this.ID_ADDRESS_CLIENT, this._userService.user.ID_USER).subscribe(
      (response: any) => {
        if (response === 0) {
          // console.log(response);
          this._router.navigate(['/clients']);
        } else {
          this.addressClient = response;
          this.ID_ADDRESS_CLIENT = this.addressClient.ID_ADDRESS_CLIENT;
          this.ID_CLIENT = this.addressClient.ID_CLIENT;
          this.idDepartamento = this.addressClient.ID_DEPARTAMENTO.toString();
          this.getProvincias(this.idDepartamento);
          this.idProvincia =  this.addressClient.ID_PROVINCIA.toString();
          this.getDistritos(this.idProvincia);
          this.idDistrito = this.addressClient.ID_DISTRITO.toString();
          // console.log(this.addressCompany);
        }
      }
    );
  }

  // Actualizar datos de sucursal
  updateAddress(address) {
    this._registerService.UpdateAddress(address, this.ID_ADDRESS_CLIENT).subscribe(
      (response: any) => {
        this.addressClient = response;
        console.log(this.addressClient);
        this.getDepartamentos();
        this.getAddressClient();
      }
    );
  }

  // Borrar sucursal
  deleteAddress() {
    // this._router.navigate(['/company', this.ID_COMPANY_USER]);
    this._userService.deleteAddress(this.ID_ADDRESS_CLIENT).subscribe(
      (response: any) => {
        this._router.navigate(['/client', this.ID_CLIENT]);
      }
    );
  }

}


