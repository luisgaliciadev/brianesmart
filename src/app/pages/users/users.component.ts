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
  public loading = false;
  public search: string;
  public activeButton;
  totalUsers = [];
  paginas = 0;
  pagina = 1;

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
    // this.getUsers(this.search);
    this.getRoles();
    this._modalUploadService.notificacion.subscribe(
      response => {
        this.getRoles();
        // this.getUsers(this.search);
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
  async getUsers(search) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this.activeButton = false;
    this.search = search;
   
    this.loading = true;
    this._userService.getUsers(search).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalUsers = response.users;
        this.users = response.users.slice(this.desde, this.hasta);
        // console.log(this.users);
        this.totalRegistros = response.users.length;
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.loading = false;
        this.activeButton = false;
      }
    );
  }

  // Borra Usuario
 async deleteUser(idUser) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.deleteUser(idUser).subscribe(
      () => {
        this.getUsers(this.search);
        this.getRoles();
      }
    );
  }

  // Exportar a excel listado de usuarios
  async getUsersExcel() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this.loading = true;
    this._userService.getUsersExcel(this.search).subscribe(
      (response: any) => {
       
        let fileBlob = response;
       
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoUsuarios.xlsx`);
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  async printer() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if(this.totalRegistros === 0) {
      return;
    }
    this._userService.loadReport();
    if (this.search.length === 0) {
      window.open('#/listusers/' + '0', '0' , '_blank');
    } else {
      window.open('#/listusers/' + this.search, '0' , '_blank');
    }
  }

  filtroPagina () {
    this.users = this.totalUsers.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

  // Cambiar pagina de lista de usuarios
  changePage(valor: number, pagina) {
    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;
    this.pagina = this.pagina + pagina;

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

    if (this.pagina >= this.paginas) {
      this.pagina = this.paginas;
    }
    
    if (this.pagina <= 0) {
      this.pagina = 1;
    }

    // this.getGuias(this.search);
    this.filtroPagina();
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
    // console.log(this.activeButton);
  }
  
}
