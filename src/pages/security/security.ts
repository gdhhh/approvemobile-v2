import {ToastService} from '../../providers/util/toast-service';
import { GlobalVar } from './../../providers/constant/constant';
import { Component } from '@angular/core';
import {LoadingController, Platform,  IonicPage,   NavController,   NavParams,   ViewController} from 'ionic-angular';

declare var cordova: any;
@Component({
  selector: 'page-security',
  templateUrl: 'security.html',
})
export class SecurityPage {

  internet;
  intranet;
  username;
  password;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastService,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    localStorage.setItem("internet", GlobalVar.security_internet);
    localStorage.setItem("intranet", GlobalVar.security_intranet);
    if(localStorage.getItem("internet")){
      this.internet =localStorage.getItem("internet");
    }
    if(localStorage.getItem("intranet")){
      this.intranet = localStorage.getItem("intranet")
    }
    if(localStorage.getItem("username")){
      this.username = localStorage.getItem("username");
    }
    if(localStorage.getItem("password")){
      this.password = localStorage.getItem("password");
    }
  }

  saveSecurityInfo(){
    //保存安全链接信息
    if(this.internet){
      localStorage.setItem("internet",this.internet);
    }
    if(this.intranet){
      localStorage.setItem("intranet",this.intranet);
    }
    if(this.username){
      localStorage.setItem("username",this.username);
    }
    if(this.password){
      localStorage.setItem("password",this.password);
    }
    this.doConnectSecurity();
  }

  doConnectSecurity(){
    let internet = localStorage.getItem("internet");
    let intranet = localStorage.getItem("intranet");
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    if(internet && intranet && username && password){

      this.platform.ready().then(() => {
        let loading = this.loadingCtrl.create({
          content: '正在验证APP安全通道状态，请稍候..'
        });
        loading.present();
        let that = this
        function success(result){
          setTimeout(()=>{
            loading.dismiss();
            that.toastCtrl.create(result,false,3000,'top');
            if(result == '安全保护隧道建立反馈：成功！'){
              that.viewCtrl.dismiss();  
            }
          },1000) 
       }
       function error(result){
         loading.dismiss();
          this.toastCtrl.create("错误，login.ts - method doConnectSecurity"+result);
       }
        cordova.exec(success, error, "AnyofficeTool","auth", [internet,intranet,username,password]);
      })
      
    }
  }
  

  closeSecurity(){
    this.viewCtrl.dismiss();
  }

}
