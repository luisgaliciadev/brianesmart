import { Injectable } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import { UserService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class ReportGuard implements CanActivate {
  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
    ) {
  }


  canActivate() {

    // tslint:disable-next-line: radix
    const report = parseInt(localStorage.getItem('report'));
    if (report === 1) {
      return true;
    } else {
      // console.log('Bloqueado por el RepoertGuard.');
      // window.close();
      this._router.navigate(['/home']);
      return false;
     }
  }

}
