import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styles: []
})
export class AddUsersComponent implements OnInit {

  public user: User;
  public PASSWORD2 = '';
  public ID_USER = 0;
  public passReset = '';
  public passReset2 = '';
  public roles;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _router: Router

  ) {
    this.user = new User('', '', '', '', 0, false, '', 0);
  }

  ngOnInit() {
    this.getRoles();
    this._route.params.forEach((params: Params) => {
      this.ID_USER = params.id;
      if (this.ID_USER > 0) {
        this._userService.getUser(this.ID_USER).subscribe(
          (response: any) => {
            this.user = response;
            // console.log(this.user);
          }
        );
      } else {
        this.ID_USER = 0;
      }
    });
  }

  getRoles() {
    this._userService.getRoles().subscribe(
      (response: any) => {
        this.roles = response;
        // console.log(this.roles);
      }
    );
  }
  saveUser(user) {
    //console.log(user);
    //return;

    if (user.PASSWORD === user.PASSWORD2) {
      this._userService.userRegister(user).subscribe(
        (response: any) => {
          this._router.navigate(['/user', response.ID_USER]);
        }
      );
    } else {
      Swal.fire('Mensaje', 'Las constraseñas no son iguales.', 'warning');
    }
  }

  updateUser(user) {
    this.user.NAME = user.NAME;
    this.user.ID_ROLE = user.ID_ROLE;
    this.user.PHONE = user.PHONE;
    this.user.ID_USER = this.ID_USER;
    // console.log(this.user);
    // return;
    this._userService.updateProfile(this.user).subscribe(
      (response: any) => {
        this._router.navigate(['/users']);
      }
    );
  }

  updatePassword(user) {

    if (user.passReset === user.passReset2) {
      this.user.PASSWORD = user.passReset;
      this.user.ID_USER = this.ID_USER;
      // console.log(this.user);
      // return;
      this._userService.updatePassword(this.user).subscribe(
        (response: any) => {
          this._router.navigate(['/users']);
        }
      );
    } else {
      Swal.fire('Mensaje', 'Las constraseñas no son iguales.', 'warning');
    }

  }

  deleteUser(idUser: number) {
    this._userService.deleteUser(idUser).subscribe(
      (response: any) => {
        this._router.navigate(['/users']);
      }
    );
  }


}
