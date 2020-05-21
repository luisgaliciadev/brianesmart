import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    ) {
  }


  canActivate() {

    // tslint:disable-next-line: radix
    const ID_MODULE = parseInt(localStorage.getItem('idModule'));

    if (ID_MODULE === 0) {
      console.log('Bloqueado por el UserGuard.');
      this._userService.logout();
      return false;
    } else {

      const menu = this._userService.menu;
      function menuValid(idMenu) {
        return idMenu.ID_MODULE === ID_MODULE;
      }

      const idModule = menu.find(menuValid);

      if (idModule) {
        return true;
       } else {
        console.log('Bloqueado por el UserGuard.');
        this._userService.logout();
        return false;
       }

    }





    // // tslint:disable-next-line: prefer-const
    // let idRolMenu = this._userService.menu[0].ID_ROLE;
    // // tslint:disable-next-line: no-conditional-assignment
    // if (this._userService.user.ID_ROLE = idRolMenu) {
    //   return true;
    // } else {
    //   console.log('Bloqueado por el UserGuard.');
    //   this._userService.logout();
    //   // this._router.navigate(['/login']);
    //   return false;
    // }
  }

}
