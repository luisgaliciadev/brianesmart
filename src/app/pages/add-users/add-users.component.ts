import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


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
    public _userService: UserService,
    public _route: ActivatedRoute,
    public _router: Router,
    private spinner: NgxSpinnerService

  ) {
    this.user = new User('', '', '', '', 0, false, '', '', 0);
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
    this.spinner.show();
    this._userService.getRoles().subscribe(
      (response: any) => {
        this.roles = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }
  saveUser(user) {
    this.spinner.show();
    if (user.PASSWORD === user.PASSWORD2) {
      this._userService.userRegister(user).subscribe(
        (response: any) => {
          this._router.navigate(['/user', response.ID_USER]);
          this.spinner.hide();
        }
      );
    } else {
      Swal.fire('Mensaje', 'Las constraseñas no son iguales.', 'warning');
      this.spinner.hide();
    }
  }

  updateUser(user) {
    this.user.NAME = user.NAME;
    this.user.ID_ROLE = user.ID_ROLE;
    this.user.PHONE = user.PHONE;
    this.user.ID_USER = this.ID_USER;
    this.user.IDEN = user.IDEN;
    this.user.EMAIL = user.EMAIL;
    this.spinner.show();
    this._userService.updateProfile(this.user).subscribe(
      (response: any) => {
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  updatePassword(user) {
    if (user.passReset === user.passReset2) {
      this.user.PASSWORD = user.passReset;
      this.user.ID_USER = this.ID_USER;    
      this.spinner.show();
      this._userService.updatePasswordAdmin(this.user).subscribe(
        (response: any) => {
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    } else {
      Swal.fire('Mensaje', 'Las constraseñas no son iguales.', 'warning');
      this.spinner.hide();
    }
  }

  deleteUser(idUser: number) {
    this.spinner.show();
    this._userService.deleteUser(idUser).subscribe(
      (response: any) => {
        this._router.navigate(['/users']);
        this.spinner.hide();
      }
    );
  }


}
