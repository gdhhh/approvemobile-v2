import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { UserInfo } from './../../providers/constant/constant';
import { HomePage } from '../home/home';
import { forbiddenNameValidator } from './../../shared/forbidden-string.directive';
import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

// import { Toast } from '@ionic-native/toast';
// import { ToastController } from 'ionic-angular';

import xml2js from 'xml2js';

import 'rxjs/add/operator/map';

@IonicPage()
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

  public loginForm: any;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private loginService: LoginServiceProvider
  ) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required, forbiddenNameValidator(/ /i)]], //禁止空格字符
      password: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(15),
      Validators.required])]
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  ionViewDidLoad() {

  }

  openResetPassword() {
  }

  doLogin() {
    this.presentLoading();
    this.formErrors["error"] = undefined;
    if (!this.loginForm.valid) {
      //检查账号密码是否有效。
      this.formErrors["error"] = this.validationMessages["invalid"]["invalid"];
    } else {
      UserInfo.prototype.userid = this.loginForm.value.username;
      UserInfo.prototype.password = this.loginForm.value.password;
      UserInfo.prototype.loginType = "manual";
      UserInfo.prototype.projectId = "0000000001";

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
          this.navCtrl.setRoot(HomePage); //跳转到首页
        } else {
          this.formErrors["error"] = this.validationMessages["invalid"]["unknowerror"];
        }
        console.log(loginResult.SysMSG[0].tips[0])
      }).catch(this.errorHandler);
    }
  }


  errorHandler(error: any) {
    if (error.status == "0") {
      alert("网络连接存在问题，请检查网络！");
    } else if (error.status.indexOf("4") == 0) {
      alert(`客户端加载故障，错误代码：` + error.status);
    } else if (error.status.indexOf("5") == 0) {
      alert(`服务器故障，错误代码：` + error.status);
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

  presentLoading() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"></div>
      </div>`,
      dismissOnPageChange: true,
      duration: 5000
    });
    loading.present();
  }

}
