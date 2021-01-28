import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'demanda'
})
export class DemandaPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultDemanda = [];
    for (const demanda of value) {
      if (demanda.ordenServicio.indexOf(arg) > -1 || demanda.origen.toUpperCase().indexOf(arg.toUpperCase()) > -1 
        || demanda.destino.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        resultDemanda.push(demanda);
      }
    }
    return resultDemanda;
  }
}
