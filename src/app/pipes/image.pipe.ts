import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, type: string): any {

    
    let url = URL_SERVICES + '/image';
    // console.log('url:', url);
    // console.log(type);
    // console.log(img);
    if (!img) {
      return url + '/user/no-img';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (type) {
      case 'user':
        url += '/user/' + img;
        break;

      case 'company':
        url += '/company/' + img;
        break;

      case 'doctor':
        url += '/doctor/' + img;
        break;

        default:
          console.log('tipo de imagen no valido.');
          url += '/user/no-img';
    }

    return url;
  }

}
