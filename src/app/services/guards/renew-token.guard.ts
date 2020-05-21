import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})

export class RenewTokenGuard implements CanActivate {

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
    ) {

  }

  canActivate(): Promise<boolean> | boolean {

    // console.log('Token Guard');

    // tslint:disable-next-line: prefer-const
    let token = this._userService.token;
    // tslint:disable-next-line: prefer-const
    let payload = JSON.parse( atob(token.split('.')[1]));

    // tslint:disable-next-line: prefer-const
    let expired = this.veryfyTokenVen(payload.exp);

    if (expired) {
      this._userService.logout();
      return false;
    }

    return this.veryfyTokenRenew(payload.exp);
  }

  // Ferificar fecha de vencimiento de token
  veryfyTokenVen(dateTokenExp: number) {

    // tslint:disable-next-line: prefer-const
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

      // tslint:disable-next-line: prefer-const
      let tokenExp = new Date( dateTokenExp * 1000);
      // tslint:disable-next-line: prefer-const
      let nowDate = new Date();

      nowDate.setTime(nowDate.getTime() + (1 * 60 * 60 * 1000));

      // console.log ('tokenExp ' + tokenExp);
      // console.log('nowDate ' + nowDate);

      if ( tokenExp.getTime() > nowDate.getTime() ) {
        resolve(true);
        // console.log('no va a vencer');
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

      //console.log(tokenExp);
      //console.log(nowDate);

      // resolve(true);
    });
  }

}
