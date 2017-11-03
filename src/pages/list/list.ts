import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NoRightPage } from '../no-right/no-right';
import { GlobalVar } from '../../providers/constant/constant';
import { NcPage } from '../nc/nc';
import { NcBillsDetailServiceProvider } from '../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { URLSearchParams } from '@angular/http';
import { ListModifyPage } from '../list-modify/list-modify';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons;
  allIcons;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public approveService: NcBillsDetailServiceProvider,
    public iab: InAppBrowser,
  ) {

  }

  ionViewDidLoad() {
    this.getIcons();
  }
  getIcons() {
    let params = new URLSearchParams();
    this.approveService.doGetMainTodoList(params).then(res => {
      let result = res.json() as any;
      if (result.icons && result.icons.length > 0) {
        if (localStorage.getItem("icons")) {
          this.icons = localStorage.getItem("icons");
        } else {
          localStorage.setItem('icons',result.icons)
          this.icons = result.icons;
        }
        this.allIcons = result.icons;
      }
    }).catch(err => {
      alert("getIcons()@list.ts =>" + err);
    });
  }

  //打开业务系统
  navTo(action, url, label) {
    switch (action) {
      case 'initApprove':
        this.navCtrl.push(NcPage);
        break;
      case 'initH5ApproveSystem':
        if (label == "ＯＡ待办") {
          const browser = this.iab.create(url + '&type=main', '_blank', 'location=no');
        } else if (label == "公告新闻") {
          const browser = this.iab.create(url + '&type=newslist', '_blank', 'location=no');
        } else if (label == "业务审批") {
          const browser = this.iab.create(GlobalVar.bpm_server_address, '_blank', 'location=no');
        }
        break;
      default:
        this.navCtrl.push(NoRightPage);
    };
  }

  modify() {
    console.log("modify")
    this.navCtrl.push(ListModifyPage)
  }

}
