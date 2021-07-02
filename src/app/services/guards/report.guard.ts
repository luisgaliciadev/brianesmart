import { Injectable } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class ReportGuard implements CanActivate {
  constructor(
    public _userService: UserService,
    public _router: Router
    ) {
  }

  canActivate() {
    const report = parseInt(localStorage.getItem('report'));
    if (report === 1) {
      return true;
    } else {
      this._router.navigate(['/home']);
      return false;
     }
  }

}
