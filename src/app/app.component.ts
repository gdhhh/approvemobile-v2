import { NcPage } from './../pages/nc/nc';
import { TabsPage } from './../pages/tabs/tabs';
import { InfoPage } from './../pages/info/info';
import { md5 } from './../utils/md5';
import { UserInfo } from './../providers/constant/constant';
import { LoginPage } from './../pages/login/login';
//import { SplashPage } from './../pages/splash/splash';
import { Component, ViewChild } from '@angular/core';
import { ModalController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

declare var networkinterface: any;
declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  //rootPage: any = NcPage;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private device: Device,
    public modalCtrl: ModalController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '主页', component: HomePage },
      { title: '应用盒子', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // splash
      //let splash = this.modalCtrl.create(SplashPage);
      // splash.present()
      if (this.device.platform == "iOS") {
        //苹果设备
        //设备名
        UserInfo.prototype.devicename = window.device.name;
        //IMEI 苹果拒绝获取IMEI 使用UUID代替
        UserInfo.prototype.IMEI = this.device.serial;
        //MAC md5 => UUID
        UserInfo.prototype.MAC = this.device.uuid;
        //IP WIFI+Carrier
        networkinterface.getWiFiIPAddress(onGetWifiIpSuccess, onGetWifiIpError);
        networkinterface.getCarrierIPAddress(onGetCarrierIpSuccess, onGetCarrierIpError);
        //appversion
        UserInfo.prototype.appVersion = this.device.appVersion;
      } else if (this.device.platform == "Android") {
        //安卓设备
        //设备名
        UserInfo.prototype.devicename = window.device.name;
        //IMEI
        UserInfo.prototype.IMEI = this.device.serial;
        //MAC
        UserInfo.prototype.MAC = this.device.uuid;
        //IP WIFI+Carrier
        networkinterface.getWiFiIPAddress(onGetWifiIpSuccess, onGetWifiIpError);
        networkinterface.getCarrierIPAddress(onGetCarrierIpSuccess, onGetCarrierIpError)
      } else {
        //浏览器或其他设备
        //设备名
        UserInfo.prototype.devicename = window.navigator.platform;
        //IMEI
        UserInfo.prototype.IMEI = "00000000"
        //MAC
        UserInfo.prototype.MAC = "00000000"
        //IP WIFI+Carrier
        UserInfo.prototype.IP = "0.0.0.0"
      }

      //获取IP地址，优先级wifi>carrier 先获取WIFI地址, 没连接WIFI再获取carrier
      function onGetWifiIpSuccess(ip) { UserInfo.prototype.IP = ip; }
      function onGetWifiIpError(err) { console.log(err); }
      function onGetCarrierIpSuccess(ip) { UserInfo.prototype.IP += " " + ip; }
      function onGetCarrierIpError(err) { console.log(err); UserInfo.prototype.IP += ' 0.0.0.0'; }
    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // openKK(){
  //   console.log("KK")
  //   const browser = this.iab.create('weixin://', '_system');

  //   	// var ref = cordova.InAppBrowser.open('weixin://', '_system');
	// 		// // some time later...
	// 		// ref.show();
  // }
  logOut() {
    this.nav.setRoot(LoginPage);
  }
}
