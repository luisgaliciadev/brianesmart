import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-agenda-telefonica',
  templateUrl: './agenda-telefonica.component.html',
  styles: [
  ]
})
export class AgendaTelefonicaComponent implements OnInit {
  agendas = [];
  loading = false;
  search = '';

  constructor(
    private _registerService: RegisterService,
    public _router: Router,
    private _userService: UserService,
    private spinner: NgxSpinnerService
  ) { 
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

  async getAgendaTelefonica() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    if (this.search === '') {
      return;
    }
    this.spinner.show();
    this._registerService.getAgendaTelefonica(this.search).subscribe(
      (response: any) => {  
        this.agendas = response.agendas;           
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }


}
