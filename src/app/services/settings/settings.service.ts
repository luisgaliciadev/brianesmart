import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  }

  constructor( @Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
   }

  // Metodo para guardar tema en el localStorage
  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
    //console.log('Ajustes iniciales guardados');
  }

  // Metodo para carga el tema guadrado en el localStorage
  cargarAjustes() {
    if ( localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      this.aplicarTema( this.ajustes.tema);
      //console.log('Ajustes Iniciales Caragados');
    } else {
      this.aplicarTema( this.ajustes.tema);
      //console.log('Ajustes Iniciales por Defectos Caragados');
    }
  }

  // Metodo para aplicar el tema guadrado en el localStorage
  aplicarTema( tema: string) {
    const url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('tema').setAttribute('href', url);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();
  }

}

interface Ajustes {
  temaUrl: string;
  tema: string;
}

