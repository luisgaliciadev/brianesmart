import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-kpitracto',
  templateUrl: './dashboard-kpitracto.component.html',
  styles: [
  ]
})
export class DashboardKpitractoComponent implements OnInit {

  constructor(
    public _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

}
