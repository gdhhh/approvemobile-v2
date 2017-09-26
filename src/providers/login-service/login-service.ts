import { GlobalVar } from './../constant/constant';
import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';


/*
登录服务
*/
@Injectable()
export class LoginServiceProvider {
  private headers: Headers;
  private serveradd = GlobalVar.server_address;
  private urlActionUserLogin = this.serveradd + "ActionUserLogin"


  constructor(public http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  doLogin(params) {
    let body = new URLSearchParams();
    body.append("body", JSON.stringify(params))
   // alert("url:"+this.urlActionUserLogin +"&&&&param:"+body);
    return this.http.post(this.urlActionUserLogin, body.toString(), { headers: this.headers }).timeout(10000)
      .toPromise().then(res => {
        return res;
    })
  }


}
