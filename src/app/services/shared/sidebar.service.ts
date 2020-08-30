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
  }

}
