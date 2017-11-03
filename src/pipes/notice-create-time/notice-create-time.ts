import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NoticeCreateTimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'noticeCreateTime',
})
export class NoticeCreateTimePipe implements PipeTransform {
  /**
   * 将时间格式转换为 MM/dd格式
   */
  transform(value: string, ...args) {
    let month = '-';
    let day = '-'
    if(value){
     month = value.split(' ')[0].split('-')[1];
     day = value.split(' ')[0].split('-')[2];
    }

    return month + '/' + day;
  }
}
