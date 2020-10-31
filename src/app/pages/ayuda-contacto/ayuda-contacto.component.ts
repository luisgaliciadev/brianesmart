import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda-contacto',
  templateUrl: './ayuda-contacto.component.html',
  styles: [
  ]
})
export class AyudaContactoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  abrirWs() {
    window.open("https://wa.link/g0fw6s");   
  }

}
