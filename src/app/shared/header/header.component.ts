import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/service.index';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  public user: User;

  constructor(
     // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
    ) { }

  ngOnInit() {
    this.user = this._userService.user;
    // console.log('user: ' + this.user.NAME);
  }

  search(termino) {
    this._router.navigate(['/search', termino]);
  }

}
