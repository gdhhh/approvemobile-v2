import 'rxjs/add/operator/map';

/*
系统常量配置
*/

export const GlobalVar = Object.freeze({
  //server_address:"http://mip.nimble.cn:8080/",
  server_address:"http://mp.nimble.cn:88/portal/",
  //server_address:"http://172.22.31.36:8080/",
  oa_server_address:"http://mjoa.nimble.cn/",
  bpm_server_address:"http://bpm.nimble.cn:8080/",
  security_internet: "113.98.115.149",
  security_intranet: "172.16.0.175"
})

export class UserInfo{
    public id: string;
    public name: string;
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

    cleanUser(){
      this.id = "";
      this.name= "";
      this.userid = "";
      this.password = "";
      this.token = "";
      this.devicename = "";
      this.MAC = "";
      this.IMEI = "";
      this.IP = "";
      this.systemid = "";
      this.loginType = "";
    }
}