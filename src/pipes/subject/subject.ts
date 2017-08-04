import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SubjectPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'subject',
})
export class SubjectPipe implements PipeTransform {
  /**
   * 去除OA主题前叙
   */
  transform(value: string) {
    let str = value;
    if (value.indexOf("--") > 0) {
      str = value.substring(value.indexOf("--") + 2, value.length);
    }
    return str;
  }
}
