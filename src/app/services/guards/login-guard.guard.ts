import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
    ) {

  }

  canActivate() {

    
    if (this._userService.isLoged()) {
      //console.log('login guard');
      return true;
    } else {
      console.log('Guard: No loged');
      this._userService.logout();
      //this._router.navigate(['/login']);
      return false;
    }
  }
}
