import { Component, OnInit, APP_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/service.index'
import { User } from '../models/user.model';
import { URL_SERVICES } from '../config/config';

declare function init_plugins();

// Google
declare const gapi: any;
// ************************

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  URL = URL_SERVICES;
  public remenberme: boolean;
  public user: User;
  public email: string;

  // Google
  public auth2: any;
  // *****************

  // tslint:disable-next-line: variable-name
  constructor(
    // tslint:disable-next-line: variable-name
    public _router: Router,
    // tslint:disable-next-line: variable-name
    public _userService: UserService
    ) {
    this.remenberme = false;
   }

  ngOnInit() {
    init_plugins();
    this.googleInit();
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
    this.user = new User(null, forma.value.email, forma.value.password);
    this._userService.login(this.user, forma.value.remenberme).subscribe(
      response => {
        // console.log(response);
        this._router.navigate(['/home']);
        //window.location.href = '#/dashboard';
      }
    );
  }

  // Google
  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        // client_id: '995556041618-co4fd9p64bbp8s74hk5rcejto573tshd.apps.googleusercontent.com',
        client_id: '295353309092-arngvtdajeirs462bpp37807p2jjvaen.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignIn(document.getElementById('btnGoogle'));

    });
  }

  // tslint:disable-next-line: no-shadowed-variable
  attachSignIn(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {

      // tslint:disable-next-line: prefer-const
      // let profile = googleUser.getBasicProfile();
      // tslint:disable-next-line: prefer-const
      let token = googleUser.getAuthResponse().id_token;
      this._userService.loginGoogle(token).subscribe(
        (response) => {
          // console.log(response);
          // this._router.navigate(['/dashboard']);
          window.location.href = '#/home';
        }
      );
      // console.log(token);
    });
  }

  descargarApp() {
    // window.open(this.URL +'/image/app/brianeApp.apk');
    window.open('https://drive.google.com/u/4/uc?id=1zJgo-eFZd3YUZ7OMjXXMdGYO977GeGmP&export=download');
    // console.log(URL);
  }

}
