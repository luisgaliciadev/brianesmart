import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { Client } from '../../models/client';
import { RegisterService } from 'src/app/services/service.index';
import { AddressClient } from 'src/app/models/addressClient.model';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styles: []
})
export class AddClientComponent implements OnInit {
  public client: Client;
  public ID_CLIENT: number;
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];
  public addressCompanys: any[] = [];
  public idDepartamento = '';
  public idProvincia = '';
  public idDistrito = '';
  public rucSunat = '';
  public loading;
  public idenTypeClient;
  public idenType;
  public typeClient;
  public idTypeClient;
  public addressClient: AddressClient;
  public addressClients: any[] = [];

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
    this.loading = true;
    this.client = new Client('', 0, '');
    this.idenType = 4;
    this.idTypeClient = 1;
    this.addressClient = new AddressClient(0, '', '', 0, false);
  }

  ngOnInit() {
    this.getDepartamentos();
    this.getIdTypeClient();
    this.getTypeClient();
    this._route.params.forEach((params: Params) => {
      this.ID_CLIENT = params.id;
      if (this.ID_CLIENT > 0) {
        this.getClient(this.ID_CLIENT);
        this.getAddressClients();
      }
    });
  }

  // Buscar prueba execl
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
          // console.log(response);
          if (response.RUC) {
            this.idenType = 4;
            this.idTypeClient = 1;
            this.client.COD_CLIENT = response.RUC;
            this.client.DS_CLIENT = response.RAZON_SOCIAL;
            this.client.ADDRESS = response.DIRECCION;

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

  saveClient(client) {
    this.client.ID_USER = this._userService.user.ID_USER;
    this.client.EMAIL = client.EMAIL;
    this.client.PHONE = client.PHONE;
    this.client.CONTACT = client.CONTACT;
    this.client.ID_TYPE = client.idType;
    this.client.ID_TYPE_CLIENT = client.idTypeClient;

    // tslint:disable-next-line: prefer-const
    let ruc = client.COD_CLIENT.trim();
    if (ruc.length !== 11 && client.ID_TYPE === 4) {
      Swal.fire('Mensaje', 'Debe ingresar un numero de RUC valido', 'warning');
      return;
    }
    // console.log(client);
    this._registerService.registerClient( this.client).subscribe(
      (response: any) => {
        // console.log(response);
        this.client = response;
        this.ID_CLIENT = response.ID_CLIENT;
        this.saveAddress(client, true);
        this._router.navigate(['/client',  this.ID_CLIENT]);
      }
    );
  }

  // Buscar un cliente
  getClient(ruc) {
    this._registerService.getClient(ruc).subscribe(
      (response: any) => {
          this.client = response;
          this.ID_CLIENT = response.ID_CLIENT;
          this.idenType = response.ID_TYPE;
          this.idTypeClient = response.ID_TYPE_CLIENT;
      }
    );
  }

  updateClient(client) {
    // tslint:disable-next-line: prefer-const
    let ruc = client.COD_CLIENT.trim();
    if (ruc.length !== 11 && client.idType === 4) {
      Swal.fire('Mensaje', 'Debe ingresar un numero de RUC valido', 'warning');
      return;
    }
    this.client.ID_CLIENT = this.ID_CLIENT;
    this.client.ID_USER = this._userService.user.ID_USER;
    this.client.COD_CLIENT = client.COD_CLIENT;
    this.client.EMAIL = client.EMAIL;
    this.client.PHONE = client.PHONE;
    this.client.CONTACT = client.CONTACT;
    this.client.ID_TYPE = client.idType;
    this.client.ID_TYPE_CLIENT = client.idTypeClient;
    // console.log(this.client);

    this._registerService.updateClient( this.client).subscribe(
      (response: any) => {
        this.client = response;
        this.ID_CLIENT = response.ID_CLIENT;
        this._router.navigate(['/client',  this.ID_CLIENT]);
      }
    );
  }

   // Borrar cliente
   deleteClient(id) {
    // console.log(id);
    this._registerService.deleteClient(id).subscribe(
      (response: any) => {
        // console.log(response);
        this._router.navigate(['/clients']);
      }
    );
  }

  // Listar tipo de identicacion de cliente
  getIdTypeClient() {
    this._registerService.getIdTypeClient().subscribe(
      (response: any) => {
        this.idenTypeClient =  Object.values(response);
        this.idenTypeClient = this.idenTypeClient[0];
        // console.log(this.idTypeClient);
      }
    );
  }

  // Listar tipo de cliente
  getTypeClient() {
    this._registerService.getTypeClient().subscribe(
      (response: any) => {
        this.typeClient =  Object.values(response);
        this.typeClient = this.typeClient[0];
        // console.log(this.typeClient);
      }
    );
  }

  getDepartamentos() {
    this._userService.getDepartamentos().subscribe(
      (response: any) => {
        // console.log(response);
        // const departamtos: any = Object.values(response);
        // console.log(departamtos);
        this.departamentos = Object.values(response);
        this.departamentos =  this.departamentos[0];
        // console.log(this.departamentos);
      }
    );
  }

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

  // Guardar sucursal
  saveAddress(address, principal: boolean) {
    if (address.DS_ADDRESS_CLIENT === undefined) {
      this.addressClient.DS_ADDRESS_CLIENT = 'Principal';
    } else {
      this.addressClient.DS_ADDRESS_CLIENT = address.DS_ADDRESS_CLIENT;
    }
    this.addressClient.FG_PRINCIPAL = principal;
    this.addressClient.ADDRESS = address.ADDRESS;
    this.addressClient.ID_DISTRITO = address.idDistrito;
    this.addressClient.ID_CLIENT = this.ID_CLIENT;
    this._registerService.registerAddress(this.addressClient, principal).subscribe(
      (response: any) => {
        // console.log(response);
        // this.cancelAddress();
        this.getAddressClients();
      }
    );
  }

  defaultAddressClient(address, idAddress) {
    this._registerService.defaultAddressClient(address, idAddress).subscribe(
      (response: any) => {
        this.getAddressClients();
      }
    );
  }

  // Borrar Direccion
  deleteAddress(idAddress: number) {
    this._registerService.deleteAddressClient(idAddress).subscribe(
      (response: any) => {
        this.getAddressClients();
      }
    );
  }

  getAddressClients() {
    this._registerService.getAddressClients(this.ID_CLIENT).subscribe(
      (response: any) => {
        // console.log(response);
        this.addressClients = response;
      }
    );
  }

  // Cancelar registro de direccion
  cancelAddress() {
    this.provincias = [];
    this.distritos = [];
    this.idDepartamento = '';
    this.idProvincia = '';
    this.idDistrito = '';
    this.addressClient = new AddressClient(0, '', '', 0, false, 0);
  }

}
