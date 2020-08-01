import { Component, OnInit,  OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit,  OnDestroy {

  public users;
  public search;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute,
  ) {}

  ngOnInit() {
    init_plugins();

    this._route.params.forEach((params: Params) => {
      this.search = params.search;
      if (this.search === '') {
        this.search = '0';
      }
    });

    this.getUsers(this.search);
  }

  // ngAfterViewInit() {
  //   this.activePrinter();
  // }

  ngOnDestroy() {
    this._userService.closeReport();
  }

  getUsers(search) {
    this._userService.getUsers(search).subscribe(
      (response: any) => {
        this.users = response.users;
      }
    );
  }

  activePrinter() {
    setTimeout(this.printer, 2000);
    this._userService.closeReport();
  }

  printer() {
    window.print();
  }

  toPrint() {
    var contenido= document.getElementById('report').innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
    window.close();
  }
}
