import 'rxjs/add/operator/map';

/*
系统常量配置
*/

export const GlobalVar = Object.freeze({
  server_address:"http://mip.nimble.cn:8080/"
  //server_address:"http://172.22.31.36:8080/"
})

export class UserInfo{
    public userid : string;
    public password : string;
    public token : string;
    public devicename : string;
    public MAC : string;
    public IMEI : string;
    public IP : string;
    public systemid : string;
    public loginType : string;
    public projectId : string;

    constructor(){
      this.projectId = "0000000001";
    }
}