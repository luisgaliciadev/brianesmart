import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/models/module.model';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-update-module',
  templateUrl: './update-module.component.html',
  styles: []
})
export class UpdateModuleComponent implements OnInit {

  public module;
  public typeMenus;
  public principalModules;
  public secModules;
  public idTypeMenu: string;
  public ID_MODULE: number;
  public subMenu: string;
  public idModuloPrincipal: string;
  public idModuloSec: string;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _router: Router
  ) {
    this.module = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
    this.idTypeMenu = '';
    }

  ngOnInit() {

    this._route.params.forEach((params: Params) => {
      this.ID_MODULE = params.id;
      if (this.ID_MODULE > 0) {
        this.getTmenu();
        this.getPmodules();
        this.getSmodules();
        this.getModule();
      }
    });
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

  getModule() {
    this._userService.getModule(this.ID_MODULE).subscribe(
      (response: any) => {
        this.module =  Object.values(response);
        this.module = this.module[0];
        this.idTypeMenu = this.module.ID_TYPE_MENU.toString();

        if (this.module.FG_SUB_MENU) {
          this.subMenu = '1';
        } else {
          this.subMenu = '0';
        }

        if (this.idTypeMenu === '2') {
          this.idModuloPrincipal = this.module.ID_MODULE_SEC;
          this.idModuloSec = '';
        }

        if (this.idTypeMenu === '3') {
          this.idModuloPrincipal = '';
          this.idModuloSec = this.module.ID_MODULE_SEC;
        }
        // console.log(this.module.FG_SUB_MENU);
        // console.log(module);
        // console.log(this.idTypeMenu);
      }
    );
  }

  updateModule(upateModule) {
    this.module = upateModule;
    this.module.ID_MODULE = this.ID_MODULE;
    // console.log(this.module);
    this._userService.updateModule(this.module).subscribe(
      (response: any) => {
        this.getModule();
      }
    );
  }

  deleteModule(idModule) {
    this._userService.deleteModule(idModule).subscribe(
      (response: any) => {
        this._router.navigate(['/modules']);
      }
    );
  }


  changeTypeMenu() {
    this.subMenu = '';
    this.idModuloPrincipal = '';
    this.module = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
  }

  cancel() {
    this.subMenu = '';
    this.idModuloPrincipal = '';
    this.module = new Module(0, 0, 0, 0, '', '', 0, '', '', 0);
    this.idTypeMenu = '';
  }

}
