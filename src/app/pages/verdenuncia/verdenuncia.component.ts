import { Component, OnInit } from '@angular/core';
import { RegisterService, UserService } from 'src/app/services/service.index';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Denuncia } from 'src/app/models/denuncia.model';
import { URL_SERVICES } from '../../config/config';


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
  URL = URL_SERVICES;

  constructor(
    public _registerService: RegisterService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this._route.params.forEach((params: Params) => {
      // console.log(params);
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
        // console.log(this.denuncia);
      }
    );
  }

  imprimir() {    
  }

  volver() {
    this._router.navigate(['/denuncias']);
  }

  descargar(archivo) {
    window.open(this.URL +'/image/denuncia/' + archivo);
    // console.log(URL);
  }
}


