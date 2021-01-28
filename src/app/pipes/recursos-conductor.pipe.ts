import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recursosConductor'
})
export class RecursosConductorPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const result = [];
    for (const recursos of value) {
      if (recursos.Nombre.toUpperCase().indexOf(arg.toUpperCase()) > -1 || recursos.ID_Chofer.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        result.push(recursos);
      }
    }
    return result;
  }
}
