import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videosYoutube'
})
export class VideosYoutube implements PipeTransform {
  transform(value: any, arg: any): any {
    const result = [];
    if (arg.length > 0) {      
      for (const videos of value) {
        if (videos.description.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
          result.push(videos);
        }
      }
      return result;
    } else {
      return value;
    }
  }
}
