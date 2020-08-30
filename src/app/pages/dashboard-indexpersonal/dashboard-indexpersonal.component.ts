import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-dashboard-indexpersonal',
  templateUrl: './dashboard-indexpersonal.component.html',
  styles: [
  ]
})
export class DashboardIndexpersonalComponent implements OnInit {

  constructor(
    public _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

}
