import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../service.index';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class RenewTokenGuard implements CanActivate {

  constructor(
    public _userService: UserService,   
    public _router: Router
    ) {
  }

  canActivate(): Promise<boolean> | boolean {
    let token = this._userService.token;   
    let payload = JSON.parse( atob(token.split('.')[1]));
    let expired = this.veryfyTokenVen(payload.exp);
    if (expired) {
      Swal.fire('Mensaje', 'La sesión ha caducado.', 'warning');
      this._userService.logout();
      return false;
    }
    return this.veryfyTokenRenew(payload.exp);
  }

  // Verificar fecha de vencimiento de token
  veryfyTokenVen(dateTokenExp: number) {
    let timeNow = new Date().getTime() / 1000;
    if (dateTokenExp < timeNow) {
      return true;
    } else {
      return false;
    }
  }

  // Verificar si hay que renivar token
  veryfyTokenRenew(dateTokenExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date( dateTokenExp * 1000);
      let nowDate = new Date();
      nowDate.setTime(nowDate.getTime() + (1 * 60 * 60 * 1000));
      if ( tokenExp.getTime() > nowDate.getTime() ) {
        resolve(true);
      } else {
        this._userService.renewToken().subscribe(
          () => {
            resolve(true);
          }, () => {
            this._userService.logout();
            reject(false);
          }
        );
      }
    });
  }
}
