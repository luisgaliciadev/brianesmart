import { Component, OnInit } from '@angular/core';
import { RegisterService, UserService } from 'src/app/services/service.index';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Denuncia } from 'src/app/models/denuncia.model';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-verdenuncia',
  templateUrl: './verdenuncia.component.html',
  styles: [
  ]
})
export class VerdenunciaComponent implements OnInit {
  titulo = '';
  descripcion = '';
  fecha = '';
  idDenuncia = 0;
  denuncia: Denuncia = new Denuncia('', '', false, false, '', '', '', '', '', '', '', '','');
  empleado = false;
  anonimato = false;
  URL = environment.URL_SERVICES;

  constructor(
    public _registerService: RegisterService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this._route.params.forEach((params: Params) => {
      this.idDenuncia = params.id;
      this.getDenuncia();
    });
  }

  getDenuncia() {
    this._registerService.getDenuncia(this.idDenuncia).subscribe(
      (response: any) => {
        this.denuncia = response.denuncia;
        this.empleado = this.denuncia.FG_EMPLEADO;
        this.anonimato = this.denuncia.FG_ANONIMATO;
      }
    );
  }

  imprimir() {    
  }

  volver() {
    this._router.navigate(['/denuncias']);
  }

  async descargar(archivo) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    window.open(this.URL +'/image/denuncia/' + archivo);
  }
}


