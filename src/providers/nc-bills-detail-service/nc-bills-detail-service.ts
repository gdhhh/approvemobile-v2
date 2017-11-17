import { GlobalVar, UserInfo } from '../constant/constant';
import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
NC财务单据服务
*/
@Injectable()
export class NcBillsDetailServiceProvider {
  private headers : Headers;
  private serveradd = GlobalVar.server_address;
  private urlActionApproves = this.serveradd + "ActionApproves";
  private urlActionOaList = this.serveradd + "ActionOaList";
  private urlActionBpmList = this.serveradd + "ActionBpmList";
  private urlActionMainList = this.serveradd + "ActionMainList";
  private urlActionGetFile = this.serveradd + "ActionGetFile";
  private urlActionGetIcons = this.serveradd + "ActionIcons";

  constructor(public http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type','application/x-www-form-urlencoded'); 
    //this.headers.append('Content-Type','application/x-www-form-urlencoded');
  }

  doGetApproves(params){
     let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionApproves, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }
  doGetOaTodoList(params){
    let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionOaList, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }
  doGetBpmTodoList(params){
    let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionBpmList, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }
  doGetMainTodoList(params){
    let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionMainList, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }
  doGetMainAllIcons(params){
    let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionGetIcons, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }

  doApprove(params){
    let userinfo = UserInfo.prototype;
    params.append("IMEI", userinfo.IMEI);
    params.append("IP", userinfo.IP);
    params.append("MAC", userinfo.MAC);
    params.append("deviceName", userinfo.devicename);
    params.append("projectId", userinfo.projectId);
    params.append("token", userinfo.token);
    params.append("userId", userinfo.userid);
    return this.http.post(this.urlActionApproves, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res;
    })
  }
  doGetFile(params){
    return this.http.post(this.urlActionGetFile, params.toString(),{ headers: this.headers }).toPromise().then(res =>{
      return res.json();
    })
  }
}
