import { Component, OnInit, APP_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/service.index'
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  URL = environment.URL_SERVICES;
  remenberme: boolean;
  user: User;
  email: string;
  

  // Google
  auth2: any;
  // *****************

  constructor(
    public _router: Router,
    public _userService: UserService,
    private spinner: NgxSpinnerService
    ) {
    this.remenberme = false;
   }

  ngOnInit() {
    this._userService.logout();
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    if (this.email  !== '') {
      this.remenberme = true;
    }
  }

  // Metodo para hacer el login
  login(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    this.spinner.show();
    this.user = new User(null, forma.value.email, forma.value.password);
    this._userService.login(this.user, forma.value.remenberme).subscribe(
      response => {
        this._router.navigate(['/home']);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  attachSignIn(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      let token = googleUser.getAuthResponse().id_token;
      this._userService.loginGoogle(token).subscribe(
        (response) => {
          window.location.href = '#/home';
        }
      );
    });
  }

  descargarApp() {
    window.open(this.URL +'/image/app/brianeApp.apk');
  }

}
