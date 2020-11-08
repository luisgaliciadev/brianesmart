import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuOpciones = [];
  menuPrincipal = [];
  menuSec = [];
  menuTer = [];
  menu = [];

  constructor(
    public _userService: UserService
  ) {
  }

  loadMenu() {  
    this.menu = this._userService.menu; 
    let menuPrincipal =[];
    this._userService.menu.forEach(function (menu) { 
      if (menu.ID_TYPE_MENU === 1) {
        menuPrincipal.push({ 
          DS_MODULE: menu.DS_MODULE,
          FG_POWERBI: menu.FG_POWERBI,
          FG_SUB_MENU: menu.FG_SUB_MENU,
          ICON: menu.ICON,
          ID_MODULE: menu.ID_MODULE,
          ID_MODULE_MAIN: menu.ID_MODULE_MAIN,
          ID_MODULE_SEC: menu.ID_MODULE_SEC,
          ID_TYPE_MENU: menu.ID_TYPE_MENU,
          ORDEN: menu.ORDEN,
          URL: menu.URL                              
        });
      }
    });
    this.menuPrincipal = menuPrincipal;
    
    let menuSec =[];
    this._userService.menu.forEach(function (menu) { 
      if (menu.ID_TYPE_MENU === 2) {
        menuSec.push({ 
          DS_MODULE: menu.DS_MODULE,
          FG_POWERBI: menu.FG_POWERBI,
          FG_SUB_MENU: menu.FG_SUB_MENU,
          ICON: menu.ICON,
          ID_MODULE: menu.ID_MODULE,
          ID_MODULE_MAIN: menu.ID_MODULE_MAIN,
          ID_MODULE_SEC: menu.ID_MODULE_SEC,
          ID_TYPE_MENU: menu.ID_TYPE_MENU,
          ORDEN: menu.ORDEN,
          URL: menu.URL                              
        });
      }
    });
    this.menuSec = menuSec;

    let menuTer =[];
    this._userService.menu.forEach(function (menu) { 
      if (menu.ID_TYPE_MENU === 3) {
        menuTer.push({ 
          DS_MODULE: menu.DS_MODULE,
          FG_POWERBI: menu.FG_POWERBI,
          FG_SUB_MENU: menu.FG_SUB_MENU,
          ICON: menu.ICON,
          ID_MODULE: menu.ID_MODULE,
          ID_MODULE_MAIN: menu.ID_MODULE_MAIN,
          ID_MODULE_SEC: menu.ID_MODULE_SEC,
          ID_TYPE_MENU: menu.ID_TYPE_MENU,
          ORDEN: menu.ORDEN,
          URL: menu.URL                              
        });
      }
    });
    this.menuTer = menuTer;
  }

}
