import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-dashboard-mygeotab',
  templateUrl: './dashboard-mygeotab.component.html',
  styles: [
  ]
})
export class DashboardMygeotabComponent implements OnInit {

  constructor(
    public _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

}
