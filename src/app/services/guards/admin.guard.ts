import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
    ) {

  }
  canActivate() {
    console.log(this._userService.user.ID_ROLE);
    if (this._userService.user.ID_ROLE === 1) {
      return true;
    } else {
      console.log('Bloqueado por el AdminGuard.');
      this._userService.logout();     
      return false;
    }
  }
}
