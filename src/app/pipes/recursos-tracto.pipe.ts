import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recursosTracto'
})
export class RecursosTractoPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const result = [];
    for (const recursos of value) {
      if (recursos.PLACA.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        result.push(recursos);
      }
    }
    return result;
  }
}
