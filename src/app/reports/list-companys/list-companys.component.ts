import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { ActivatedRoute, Params } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-list-companys',
  templateUrl: './list-companys.component.html',
  styleUrls: ['./list-companys.component.css']
})
export class ListCompanysComponent implements OnInit, OnDestroy {

  public companyUsers;
  public ID_USER: number;
  public search;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _route: ActivatedRoute
  ) {
    this.ID_USER = this._userService.user.ID_USER;
  }

  ngOnInit() {
    init_plugins();
    this._route.params.forEach((params: Params) => {
      this.search = params.search;
      if (this.search === '') {
        this.search = '0';
      }
    });

    this.getCompanys();
  }

  ngOnDestroy() {
    this._userService.closeReport();
  }

  // Listar empresas
  getCompanys() {
    this._userService.getCompanys(this.ID_USER, this.search).subscribe(
      (response: any) => {
        this.companyUsers = response.companys;
      }
    );
  }

  activePrinter() {
    setTimeout(this.printer, 1500);
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
