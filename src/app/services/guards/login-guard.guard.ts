import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanLoad {

  constructor(
    public _userService: UserService,
    public _router: Router
    ) {

  }

  canLoad() {
    if (this._userService.isLoged()) {
      return true;
    } else {
      console.log('Guard: No loged');
      this._userService.logout();
      return false;
    }
  }
}
