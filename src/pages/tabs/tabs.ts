import {Tab} from 'ionic-angular';
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
  tabKkSearch;
  tabInfo = InfoPage;

  constructor(private iab: InAppBrowser) {

  }
  tabSelected(tab: Tab) {
    console.log(tab.index)
    if(tab.index==2){
      this.openKK();
    }
  }
  openKK(){
    console.log("Open KK")
    const browser = this.iab.create('KK://contact', '_system');
  }
}
