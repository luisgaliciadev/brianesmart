import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import {saveAs} from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
    public _userService: UserService,
    public _modalUploadService: ModalUploadService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    ) {
      this.desde = 0;
      this.hasta = 5;
      this.search = '';
      this.activeButton = false;
    }

  ngOnInit() {
    this.getRoles();
    this._modalUploadService.notificacion.subscribe(
      response => {
        this.getRoles();
      },
    );
  }

  // Listar roles de usuario
  getRoles() {
    this._userService.getRoles().subscribe(
      (response: any) => {
        this.roles = response;
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
   
    this.spinner.show();
    this._userService.getUsers(search).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalUsers = response.users;
        this.users = response.users.slice(this.desde, this.hasta);
        this.totalRegistros = response.users.length;
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.spinner.hide();
        this.activeButton = false;
      },
      error => {
        this.spinner.hide();
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
      },
      error => {
        this.spinner.hide();
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
    this.spinner.show();
    this._userService.getUsersExcel(this.search).subscribe(
      (response: any) => {
       
        let fileBlob = response;
       
        let blob = new Blob([fileBlob], {
          type: "application/vnd.ms-excel"
        });
        // use file saver npm package for saving blob to file
        saveAs(blob, `ListadoUsuarios.xlsx`);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
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
      window.open('#/reports/listusers/' + '0', '0' , '_blank');
    } else {
      window.open('#/reports/listusers/' + this.search, '0' , '_blank');
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
  }
  
}
