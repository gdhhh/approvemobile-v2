import { Device } from '@ionic-native/device';
import { LoadingService } from './../../providers/util/loading-service';
import { ToastService } from './../../providers/util/toast-service';
import { SecurityPage } from './../security/security';
import { TabsPage } from './../tabs/tabs';
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { UserInfo } from './../../providers/constant/constant';
import { HomePage } from '../home/home';
import { forbiddenNameValidator } from './../../shared/forbidden-string.directive';
import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ModalController, Platform } from 'ionic-angular';

// import { Toast } from '@ionic-native/toast';
// import { ToastController } from 'ionic-angular';

import xml2js from 'xml2js';
import {URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/map';
declare var cordova: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class LoginPage {

  backgrounds = [
    "assets/img/background/bg-1.png",
    "assets/img/background/bg-3.png",
    "assets/img/background/bg-5.png",
    "assets/img/background/bg-7.png",
    "assets/img/background/bg-9.png"
  ]
  formErrors = {
    'username': undefined,
    'password': undefined
  };
  validationMessages = {
    'username': {
      'required': '请填写登录名，一般与OA登录名一致。',
      'minlength': '登录名不能小于3位。',
      'maxlength': '你输入的有点多哦。',
      'forbiddenName': '账号不能存在空格。'
    },
    'password': {
      'required': '请输入密码，一般与您的OA密码一致。',
      'minlength': '密码不能小于3位。',
      'maxlength': '你输入的有点多哦。'
    },
    'invalid': {
      'invalid': '您的账号或密码有误，请检查!',
      'noright': '您的设备没有权限登录，请拨打分机 5300 IT热线申请开通权限。',
      'notallowed': '您的账号密码为空，或者存在特殊字符，请检查!',
      'unknowerror': '此错误一般由于网络中断导致，请检查数据网络或wifi网络是否通畅，如果此问题仍存在，请联系管理员。'
    }
  };

  isShowVPNSetting = false;
  loginUserName;
  loginPassword;
  date:Date;

  public loginForm: any;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public toastCtrl: ToastService,
    public device: Device,
    private loginService: LoginServiceProvider
  ) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required]], //禁止空格字符
      password: ['', Validators.compose([Validators.maxLength(15),
      Validators.required])]
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  ionViewDidLoad() {
       //集成华为安全
        // if(this.devce.platform =="iOS"){
          // if(localStorage.getItem("loginName")){
          //   this.loginForm.value.username = localStorage.getItem("loginName");
          // }
          // this.isShowVPNSetting = true;
          // if(
          //   localStorage.getItem("intranet") &&
          //   localStorage.getItem("internet") &&
          //   localStorage.getItem("username") &&
          //   localStorage.getItem("password")
          // ){
          //   this.doConnectSecurity();
          // }else{
          //   this.openSecurity();
          //   this.toastCtrl.create("您的安全设置不正确,请重新检查。");
          // }
        // }
  }
  ionViewDidEnter(){
    if(localStorage.getItem("username")){
      this.loginUserName = localStorage.getItem("username");
    }
    let d =Date as any;
    let lastTime = localStorage.getItem("time") as any;
    if(localStorage.getItem("username")&&localStorage.getItem("password")&&localStorage.getItem("time") && d.parse(new Date()) - lastTime < 1800000){
        this.loginPassword = localStorage.getItem("password");
        this.loginUserName = localStorage.getItem("username");
        setTimeout(()=>{
          this.doLogin();
        },1000)
        
    }else{
      localStorage.removeItem("password")
    }
  }

  openResetPassword() {
  }

  doLogin() { 
    this.formErrors["error"] = undefined;
    if (!this.loginForm.valid) {
      //检查账号密码是否有效。
      this.formErrors["error"] = this.validationMessages["invalid"]["invalid"];
    } else {
      let loading = this.loadingCtrl.create({
        content: '登录中，请稍候..'
      });
      loading.present();
      if(this.loginForm.value.username){
        let name = this.loginForm.value.username;
        name = name.toLowerCase();
        this.loginForm.value.username = name.replace(/\s+/g,"");
      }
      UserInfo.prototype.userid = this.loginForm.value.username;
      UserInfo.prototype.password = this.loginForm.value.password;
      UserInfo.prototype.loginType = "manual";
      UserInfo.prototype.projectId = "0000000001";

      setTimeout(()=>{
        this.loginService.doLogin(UserInfo.prototype).then(res => {
          let loginResult;
          xml2js.parseString(res.text(), function (err, result) {
            loginResult = result.response
          })
          if (loginResult.SysMSG[0].tips[0] == "loginFail") {
            //账号或密码错误，请核实后重新登录。
            this.formErrors["error"] = this.validationMessages["invalid"]["invalid"];
          } else if (loginResult.SysMSG[0].tips[0] == "DeviceAccessNotAllow") {
            //您的设备没有授权登录此系统，请联系管理员开通权限。
            this.formErrors["error"] = this.validationMessages["invalid"]["noright"];
          } else if (loginResult.SysMSG[0].tips[0] == "loginOK") {
            //登录成功，跳转到主页
            UserInfo.prototype.token = loginResult.SysMSG[0].token;
            UserInfo.prototype.id = loginResult.datas[0].userId;
            UserInfo.prototype.name = decodeURIComponent(loginResult.datas[0].name);
            localStorage.setItem("loginName",UserInfo.prototype.name);
            localStorage.setItem("username",UserInfo.prototype.userid);
            localStorage.setItem("password",UserInfo.prototype.password);
            this.date = new Date(Date.now());
            let d =Date as any;
            localStorage.setItem("time",d.parse(this.date));
            this.navCtrl.setRoot(TabsPage); //跳转到首页
          } else {
            this.formErrors["error"] = this.validationMessages["invalid"]["unknowerror"];
          }
          loading.dismiss();
        }).catch(err=>{
          loading.dismiss();
          this.errorHandler(err);
        });
      },1000);
      
    }
  }


  errorHandler(error: any) {
    if (error.status == "0") {
      alert("无法连接服务器，请检查网络连接！");
    } else if (error.status !=undefined && error.status.indexOf("4") == 0) {
      alert(`客户端加载故障，错误代码：` + error.status);
    } else if (error.status !=undefined && error.status.indexOf("5") == 0) {
      alert(`服务器故障，错误代码：` + error.status);
    } else if( error.message == "Timeout has occurred"){
      alert(`请求超时,请稍后重试！` );
    }
    else{
      alert("错误信息："+ error.message +"</br>" + "错误区块："+ error.stack)
    }
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = undefined;
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = messages[key];
        }
      }
    }
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
          loading.dismiss();
          that.toastCtrl.create(result,false,3000,'top');
       }
       function error(result){
         loading.dismiss();
          this.toastCtrl.create("错误，login.ts - method doConnectSecurity"+result);
       }
        cordova.exec(success, error, "AnyofficeTool","auth", [internet,intranet,username,password]);
      })
      
    }
  }

  // openSecurity(){
  //   let securityModal = this.modalCtrl.create(SecurityPage, {} , {});
  //   // securityModal.onDidDismiss(data =>{
  //   //   this.doConnectSecurity();
  //   // })
  //   securityModal.present();
  // }

  //打开安全应用
  openSecurity(){
    if (this.device.platform == "iOS") {
      debugger;
      var sApp = (window as any).startApp.set("anyoffice://");
      sApp.check(function (values) { /* success */
        sApp.start(function () { /* success */
          console.log("anyoffice lanuch OK");
        }, function (error) { /* fail */
          alert("打开anyoffice失败" + error);
        });
      }, function (error) { /* fail */
        var r = confirm("检测到您手机未安装anyoffice安全应用，是否要下载？");
        if (r == true) {
          (window as any).open("https://fir.im/mjaqaz")
        }
      });
    } else if (this.device.platform == "Android") {
      let appId = "com.huawei.svn.hiwork";
      let appStarter = (window as any).startApp.set({ "package": appId });
      appStarter.start(function (msg) {
         console.log('starting kk app: ' + msg);
      }, function (err) {
        console.log('anyoffice app not installed', err);
        var r = confirm("检测到您手机未安装anyoffice安全应用，是否要下载？");
        if (r == true) {
          (window as any).open("https://fir.im/mjaqaz")
        }
      });
    } else {
      alert("不能打开KK")
    }
  }
}
