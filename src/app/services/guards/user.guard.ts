import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    public _userService: UserService,
    ) {
  }


  canActivate() {

    // let idModule = (localStorage.getItem('idModule'));
    // let menu = localStorage.getItem('menu');
    // console.log(idModule);
    // console.log(menu);

    // if (menu.indexOf(idModule) < 0) {
    //   console.log('no tiene permiso')
    // }





    return true;



  //   if (ID_MODULE === 0) {
  //     console.log('Bloqueado por el UserGuard.');
  //     this._userService.logout();
  //     return false;
  //   } else {

  //     const menu = this._userService.menu;
  //     function menuValid(idMenu) {
  //       return idMenu.ID_MODULE === ID_MODULE;
  //     }

  //     const idModule = menu.find(menuValid);

  //     if (idModule) {
  //       return true;
  //      } else {
  //       console.log('Bloqueado por el UserGuard.');
  //       this._userService.logout();
  //       return false;
  //      }

  //   }
  }

}
