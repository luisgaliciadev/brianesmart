import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  public users;
  public roles;
  public desde: number;
  public hasta: number;
  public totalRegistros = 0;
  public loading = true;
  public search: string;
  public activeButton;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService
    ) {
      this.desde = 0;
      this.hasta = 5;
      this.search = '';
      this.activeButton = false;
    }

  ngOnInit() {
    this.getUsers(this.search);
    this.getRoles();
    this._modalUploadService.notificacion.subscribe(
      response => {
        this.getRoles();
        this.getUsers(this.search);
      },
    );
  }

  // Listar roles de usuario
  getRoles() {
    this._userService.getRoles().subscribe(
      (response: any) => {
        this.roles = response;
        // console.log(this.roles);
      }
    );
  }

  // Listar usuarios
  getUsers(search) {
    this.activeButton = false;
    this.search = search;
    // tslint:disable-next-line: prefer-const
    this.loading = true;
    this._userService.getUsers(search).subscribe(
      (response: any) => {
        this.users = response.users.slice(this.desde, this.hasta);
        this.totalRegistros = response.users.length;
        this.loading = false;
      }
    );
  }

  // Borra Usuario
  deleteUser(idUser) {
    this._userService.deleteUser(idUser).subscribe(
      () => {
        this.getUsers(this.search);
        this.getRoles();
      }
    );
  }

  // Exportar a excel listado de usuarios
  getUsersExcel() {
    this._userService.getUsersExcel(this.search).subscribe(
      (response: any) => {
        // tslint:disable-next-line: prefer-const
        let fileBlob = response;
        // tslint:disable-next-line: prefer-const
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoUsuarios.xlsx`);
      }
    );
  }

  printer() {
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listusers/' + '0', '0' , '_blank');
    } else {
      window.open('#/listusers/' + this.search, '0' , '_blank');
    }
  }

  // Cambiar pagina de lista de usuarios
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

    this.getUsers(this.search);
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    this.getUsers(this.search);
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getUsers(this.search);
    }
    console.log(this.activeButton);
  }
  
}
