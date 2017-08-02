import { InfoPage } from './../info/info';
import { ListPage } from './../list/list';
import {HomePage} from '../home/home';
import { Component } from '@angular/core';

import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabList = ListPage;
  tabKkSearch = this.openKK();
  tabInfo = InfoPage;

  constructor(private iab: InAppBrowser) {

  }
  
  openKK(){
    console.log("Open KK")
    const browser = this.iab.create('KK://contact', '_system');

    	// var ref = cordova.InAppBrowser.open('weixin://', '_system');
			// // some time later...
			// ref.show();
  }
}
