import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-estadosp',
  templateUrl: './dashboard-estadosp.component.html',
  styles: [
  ]
})
export class DashboardEstadospComponent implements OnInit {
  private _userService: any;
  private _router: any;

  constructor() { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

}
