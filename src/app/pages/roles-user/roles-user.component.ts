import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles-user',
  templateUrl: './roles-user.component.html',
  styles: []
})
export class RolesUserComponent implements OnInit {
  public roles;
  public dsRoles = '';
  public role;
  public DS_ROLE = '';

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService
  ) {
    // this.role = [0, ''];
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this._userService.getRoles().subscribe(
      (response: any) => {
        this.roles =  Object.values(response);
        this.roles = this.roles;
        // console.log( this.roles);
      }
    );
  }

  saveRole(dsRole) {
    this._userService.registerRole(dsRole).subscribe( () => { this.getRoles(); });
  }

  updateRole(role) {
    if (role.DS_ROLE === '') {
      Swal.fire('Mensaje', 'Debe indicar una descripcion para el rol de usuario.', 'warning');
      return;
    } else {
      this._userService.updateRole(role).subscribe( () => { this.getRoles(); });
    }
  }

  deleteRole(role) {
    this._userService.deleteRole(role).subscribe( () => { this.getRoles(); });
  }

  cancel() {
    this.dsRoles = '';
  }
}
