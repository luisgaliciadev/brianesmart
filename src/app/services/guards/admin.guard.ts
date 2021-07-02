import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _userService: UserService,
    public _router: Router
    ) {
  }
  canActivate() {
    if (this._userService.user.ID_ROLE === 1) {
      return true;
    } else {
      this._userService.logout();     
      return false;
    }
  }
}
