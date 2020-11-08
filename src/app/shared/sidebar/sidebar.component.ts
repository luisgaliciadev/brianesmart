import { Component, OnInit } from '@angular/core';
import { SidebarService, UserService } from '../../services/service.index';
import { User } from 'src/app/models/user.model';

// declare function init_plugins();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})

export class SidebarComponent implements OnInit {

  user: User;
  menuPrincipal = [];
  menuSec = [];
  menuTer = [];

  constructor(
    public _sidebar: SidebarService,
    public _userService: UserService
    ) {
     }

  ngOnInit() {
    this.user = this._userService.user;
    this._sidebar.loadMenu();
  }

  idModule(idModule) {
    this._userService.idModule(idModule);
  }

}
