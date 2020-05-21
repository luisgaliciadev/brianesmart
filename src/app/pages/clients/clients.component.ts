import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: []
})
export class ClientsComponent implements OnInit {
  public clients: Client[] = [];
  public desde: number;
  public hasta: number;
  public loading = true;
  public totalRegistros = 0;
  public search: string;
  public activeButton;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router,
    // tslint:disable-next-line: variable-name
    public _registerService: RegisterService
  ) {
    this.search = '';
   }

  ngOnInit() {
    this.getClients(this.search);
  }



  // Listar clientes
  getClients(search) {
    this.activeButton = false;
    this.search = search;

    this.loading = true;
    this._registerService.getClients(this.search).subscribe(
      (response: any) => {
        this.clients = response.clients.slice(this.desde, this.hasta);
        this.totalRegistros = response.clients.length;
        this.loading = false;
        // console.log(this.clients);
      }
    );
  }

  // Borrar cliente
  deleteClient(id) {
    // console.log(id);
    this._registerService.deleteClient(id).subscribe(
      (response: any) => {
        // console.log(response);
        this.getClients(this.search);
      }
    );
  }

  // Exportar a excel listado de empresas
  getClientsExcel() {
    this._userService.getClientsExcel(this.search).subscribe(
      (response: any) => {
        // tslint:disable-next-line: prefer-const
        let fileBlob = response;
        // tslint:disable-next-line: prefer-const
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoClientes.xlsx`);
      }
    );
  }


  // Cambiar pagina de lista de empresas
  changePage(valor: number) {

    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;

    if (this.desde >= this.totalRegistros) {
      this.desde = this.desde - 5;
      this.hasta = this.desde + 5;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 5) {
      this.hasta = 5;
    }

    // this.getCompanys(this.search);
  }



  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listclients/' + '0', '0', '_blank');
    } else {
      window.open('#/listclients/' + this.search, '0' , '_blank');
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getClients(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getClients(this.search);
    }
  }

}
