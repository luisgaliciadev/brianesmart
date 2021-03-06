import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
// import { MdbTreeComponent } from 'ng-uikit-pro-standard';
// import { runInThisContext } from 'vm';


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styles: []
})
export class PermissionsComponent implements OnInit {
  public ID_TYPE_MENU: number;
  public ID_ROLE = 0;
  public typeMenus;
  public roles;
  public allModules;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService
  ) {
      this.ID_TYPE_MENU = 1;
      // this.ID_ROLE = 2;
   }

  ngOnInit() {
    this.getTmenu();
    this.getRolesUser();
    // this.getsModulesRol(this.ID_TYPE_MENU, this.ID_ROLE);
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

  getRolesUser() {
    this._userService.getRolesUser().subscribe(
      (response: any) => {
        this.roles = response;
      }
    );
  }

  getsModulesRol(idTypeMenu, idRole) {
    this._userService.getsModulesRol(idTypeMenu, idRole).subscribe(
      (response: any) => {
        this.allModules =  Object.values(response);
        this.allModules = this.allModules[0];
        // console.log(this.allModules);
      }
    );
  }

  async getsRolModules(idRole) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.getsRolModules(idRole).subscribe(
      (response: any) => {
        // console.log(response);
        // this.allModules =  Object.values(response);
        this.allModules = response.RolModules;
        // console.log(this.allModules);
      }
    );
  }

  async updateRolesModules(modules) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    // console.log(modules);
    this._userService.updateRolesModules(modules).subscribe(
      (response: any) => {
        // console.log(response);
        this.getsRolModules(this.ID_ROLE);
        // this.getsModulesRol(this.ID_TYPE_MENU, this.ID_ROLE);
      }
    );
  }


}
