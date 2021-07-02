import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rendimientoConductor'
})
export class RendimientoConductorPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const result = [];
    for (const rendimiento of value) {
      if (rendimiento.NOMBRES.toUpperCase().indexOf(arg.toUpperCase()) > -1 || rendimiento.DNI.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        result.push(rendimiento);
      }
    }
    return result;
  }

}
