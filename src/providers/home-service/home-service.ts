import { GlobalVar } from './../constant/constant';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
首页服务
*/
@Injectable()
export class HomeServiceProvider {

  serveradd = GlobalVar.server_address;
  private headers : Headers;

  constructor(public http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  getTopNotice(){
     return this.http.post(this.serveradd+'ActionOaNotice', {}, { headers: this.headers })
      .toPromise().then(res => {
        console.log(res.json())
        return res.json();
    })
    // return this.http.get(this.serveradd+'ActionOaNotice').toPromise().then(res =>{
    //   console.log(res.json())
    //   return res.json()
    // })
  }

}
