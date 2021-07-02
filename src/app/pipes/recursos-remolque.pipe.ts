import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recursosRemolque'
})
export class RecursosRemolquePipe implements PipeTransform {
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
