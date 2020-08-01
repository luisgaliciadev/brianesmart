import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
 // import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[];
  public idRole: number;
  public modules: any[];
  public menus: any[];

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService
  ) {
    this.menu = [];
  }

  loadMenu() {
    this.menu = this._userService.menu;
    // console.log(this.menu);

    // this.idRole = this._userService.idRole;
    // console.log(this.idRole);

    // this._userService.getModules(this.idRole).subscribe(
    //   (response: any) => {
    //     this.modules = Object.values(response);
    //     this.modules = this.modules[0];
    //     console.log(this.modules);
    //   }
    // );

    // this._userService.getMenu(this.idRole).subscribe(
    //   (response: any) => {
    //     // console.log(response);
    //     this.menus = Object.values(response);
    //     this.menus = this.menus[0];
    //     console.log(this.menus);
    //   }
    // );

  }

}
