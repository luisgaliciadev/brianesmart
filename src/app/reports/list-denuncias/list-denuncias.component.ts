import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import { ActivatedRoute, Params } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-list-denuncias',
  templateUrl: './list-denuncias.component.html',
  styles: [
  ]
})
export class ListDenunciasComponent implements OnInit {
  
  denuncias = [];
  search = '';

  constructor(
    public _userService: UserService,
    public _registerService: RegisterService,
    public _route: ActivatedRoute
  ) { 
    this._route.params.forEach((params: Params) => {
      this.search = params.search;
      if (this.search === '') {
        this.search = '0';
      }
    });
  }

  ngOnInit(): void {
    init_plugins();
    this.getDenuncias(this.search);
  }

  ngOnDestroy() {
    this._userService.closeReport();
  }

  getDenuncias(search) {
    this._registerService.getDenuncias(search).subscribe(
      (response: any) => {
        this.denuncias = response.denuncias;
        console.log(response);
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
