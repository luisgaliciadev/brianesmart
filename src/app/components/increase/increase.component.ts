import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-increase',
  templateUrl: './increase.component.html',
  styles: []
})
export class IncreaseComponent implements OnInit {

  @ViewChild('txtProgress', {static: true}) txtProgress: ElementRef;
  
  @Input('nombre') public leyenda: string;
  @Input() public porcentaje: number;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();
  
  constructor() {
    this.porcentaje = 50;
    //this.porcentaje2 = 50;
    this.leyenda = 'leyenda';
  }

  ngOnInit() {
  }

  // VALIDA QUE SE ESCRIBAN SOLO VALORES DE 0 A 100
  onChange(newValue: number) {
    // let elementHTML: any = document.getElementsByName('porcentaje')[0];
    // console.log(this.txtProgress);
    if (newValue >= 100) {
      this.porcentaje = 100;
    } else if (newValue <= 0 || newValue == null) {
        this.porcentaje = 0;
    } else {
      this.porcentaje = newValue;
    }

    // elementHTML.value = this.porcentaje;
    this.txtProgress.nativeElement.value = this.porcentaje;
    this.cambioValor.emit( this.porcentaje );
  }

  cambiarValor(valor) {
    this.porcentaje =  this.porcentaje + valor;

    if (this.porcentaje >= 100) {
      this.porcentaje = 100;
    }

    if (this.porcentaje <= 0) {
      this.porcentaje = 0;
    }

    this.cambioValor.emit( this.porcentaje );
    this.txtProgress.nativeElement.focus();
  }

}
