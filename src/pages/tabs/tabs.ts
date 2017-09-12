import { Device } from '@ionic-native/device';
import { Tab } from 'ionic-angular';
import { InfoPage } from './../info/info';
import { ListPage } from './../list/list';
import { HomePage } from '../home/home';
import { Component } from '@angular/core';

import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabList = ListPage;
  tabKkSearch;
  tabInfo = InfoPage;

  constructor(
    private iab: InAppBrowser,
    private device: Device
  ) {

  }
  tabSelected(tab: Tab) {
    console.log(tab.index)
    if (tab.index == 2) {
      this.openKK();
    }
  }
  openKK() {
    if (this.device.platform == "iOS") {
      debugger;
      var sApp = (window as any).startApp.set("kk://");
      sApp.check(function (values) { /* success */
        sApp.start(function () { /* success */
          console.log("kk lanuch OK");
        }, function (error) { /* fail */
          console.log("打开KK失败" + error);
        });
      }, function (error) { /* fail */
        var r = confirm("检测到您手机未安装KK，是否要下载KK？");
        if (r == true) {
          (window as any).open("https://fir.im/iph")
        }
      });
    } else if (this.device.platform == "Android") {
      let appId = "com.landray.kkplus";
      let appStarter = (window as any).startApp.set({ "package": appId });
      appStarter.start(function (msg) {
         console.log('starting kk app: ' + msg);
      }, function (err) {
        console.log('KK app not installed', err);
        var r = confirm("检测到您手机未安装KK应用，是否要下载KK？");
        if (r == true) {
          (window as any).open("https://fir.im/iph")
        }
      });
    } else {
      console.log("不能打开KK")
    }
    console.log("Open KK")


  }
}
