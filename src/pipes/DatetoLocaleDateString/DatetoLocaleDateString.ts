import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimestrampToDatetimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'DateToLocaleDateString',
})
export class DateToLocaleDateStringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, arg: any) {
    let date = new Date( parseInt(value)).toLocaleDateString();
    return date;
  }
}
