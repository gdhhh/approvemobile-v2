import {HomePage} from '../home/home';
import { forbiddenNameValidator } from './../../shared/forbidden-string.directive';
import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

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
      'notallowed': '你的账号密码为空，或者存在特殊字符，请检查!'
    }
  };

  public loginForm: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {
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
    console.log('Hello LoginBackgroundSlider Page');
  }

  openResetPassword() {
  }

  doLogin() {
    if (!this.loginForm.valid) {
      console.log("Invalid or empty data1");
      this.formErrors["invalid"] = this.validationMessages["invalid"]["invalid"];
    } else {
      let authenticated = true;
      let noright = true;

      if (authenticated) {
        let userName = this.loginForm.value.username;
        let userPassword = this.loginForm.value.password;
        console.log('user data', userName, userPassword);     
        this.navCtrl.setRoot(HomePage); //跳转到首页
      } else if( noright){
         this.formErrors["noright"] = this.validationMessages["invalid"]["noright"];
      }


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

}
