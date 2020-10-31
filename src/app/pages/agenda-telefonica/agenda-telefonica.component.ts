import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private _userService: UserService
  ) { 
  }

  ngOnInit(): void {
    console.log('this._router.url:', this._router.url);
    this._userService.permisoModule(this._router.url);
  }

  getAgendaTelefonica() {
    if (this.search === '') {
      return;
    }
    this.loading = true;
    this._registerService.getAgendaTelefonica(this.search).subscribe(
      (response: any) => {
        console.log('response:', response);
        this.agendas = response.agendas;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  marcaje() {
  
    this._registerService.marcajes().subscribe(
      (response: any) => {
        console.log('response:', response);
      }
    );
  }

  prueba() {
  
    this._registerService.prueba().subscribe(
      (response: any) => {
        console.log('response:', response);
      }
    );
  }

}
