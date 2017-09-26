import {LoginPage} from '../login/login';
import { UserInfo } from './../../providers/constant/constant';
import { Component, ViewChild } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, App } from 'ionic-angular';

import {URLSearchParams} from '@angular/http';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  @ViewChild(Nav) nav: Nav;
  userInfo;
  

  following = false;
  user = {
    name: 'Paula Bolliger',
    profileImage: 'assets/img/avatar/girl-avatar.png',
    coverImage: 'assets/img/background/background-5.jpg',
    occupation: 'Designer',
    location: 'Seattle, WA',
    description: 'A wise man once said: The more you do something, the better you will become at it.',
    followers: 456,
    following: 1052,
    posts: 35
  }

  constructor(
    public navCtrl: NavController, 
    public app:App) { }

  ionViewDidLoad() {
    console.log('Hello ProfileFour Page');
    console.log(UserInfo.prototype)
    this.userInfo = UserInfo.prototype;
  }

  ionViewDidEnter(){
    //console.log(UserInfo.prototype)
  }

  logOut() {
    //UserInfo.prototype.cleanUser();
    this.app.getRootNav().setRoot(LoginPage);
    localStorage.removeItem("password");
  }

}
