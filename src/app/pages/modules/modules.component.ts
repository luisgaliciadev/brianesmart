import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { Module } from '../../models/module.model';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styles: []
})
export class ModulesComponent implements OnInit {
  public modules: Module;
  public typeMenus;
  public principalModules;
  public secModules;
  public allModules;
  public idTypeMenu: string;
  public ID_MODULE: number;
  public subMenu: string;
  public idModuloPrincipal: string;
  public idModuloSec: string;
  public DS_ADDRESS_COMPANY: string;
  public ID_TYPE_MENU: number;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService
  ) {
    this.modules = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
    this.idTypeMenu = '';
    this.ID_MODULE = 0;
    this.subMenu = '';
    this.idModuloPrincipal = '';
    this.ID_TYPE_MENU = 1;
  }

  ngOnInit() {
    this.getTmenu();
    this.getPmodules();
    this.getSmodules();
    this.getModules(this.ID_TYPE_MENU);
  }


  getTmenu() {
    this._userService.getsTmenu().subscribe(
      (response: any) => {
        this.typeMenus =  Object.values(response);
        this.typeMenus = this.typeMenus[0];
        // console.log(this.typeMenus);
      }
    );
  }

  getPmodules() {
    this._userService.getsPmodules().subscribe(
      (response: any) => {
        this.principalModules =  Object.values(response);
        this.principalModules = this.principalModules[0];
        // console.log(this.principalModules);
      }
    );
  }

  getSmodules() {
    this._userService.getsSmodules().subscribe(
      (response: any) => {
        this.secModules =  Object.values(response);
        this.secModules = this.secModules[0];
        // console.log(this.secModules);
      }
    );
  }

  getModules(idTypeMenu) {
    this._userService.getsModules(idTypeMenu).subscribe(
      (response: any) => {
        this.allModules =  Object.values(response);
        this.allModules = this.allModules[0];
        // console.log(this.allModules);
      }
    );
  }

  saveModule(datos) {
    this.modules = datos;
    // console.log(this.modules);
    this._userService.registerModule(datos).subscribe(
      response => {
        this.getPmodules();
        this. getSmodules();
        this.getModules(this.ID_TYPE_MENU);
      }
    );
  }

  deleteModule(idModule) {
    this._userService.deleteModule(idModule).subscribe(
      (response: any) => {
        this.getTmenu();
        this.getPmodules();
        this.getSmodules();
        this.getModules(this.ID_TYPE_MENU);
      }
    );
  }

  moveModule(module: Module, move) {
    this.modules = module;
    // console.log(this.modules);
    // return;
    this._userService.moveModule(this.modules, move).subscribe(
      (response: any) => {
        this.getTmenu();
        this.getPmodules();
        this.getSmodules();
        this.getModules(this.ID_TYPE_MENU);
      }
    );
  }

  changeTypeMenu() {
    this.ID_MODULE = 0;
    this.subMenu = '';
    this.idModuloPrincipal = '';
    this.modules = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
  }

  cancel() {
    this.ID_MODULE = 0;
    this.subMenu = '';
    this.idModuloPrincipal = '';
    this.modules = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
    this.idTypeMenu = '';
  }

}
