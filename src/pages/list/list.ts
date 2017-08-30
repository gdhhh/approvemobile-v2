import {NoRightPage} from '../no-right/no-right';
import {GlobalVar} from '../../providers/constant/constant';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {NcPage} from '../nc/nc';
import {NcBillsDetailServiceProvider} from '../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public approveService: NcBillsDetailServiceProvider,
    private iab: InAppBrowser,
    public loadingCtrl: LoadingController
  ) {
  
  }

  ionViewDidLoad() {
    this.getIcons();
  }
  getIcons() {
    let loading = this.loadingCtrl.create({
      content: '数据加载中，请稍候...'
    });
    loading.present();
    let params = new URLSearchParams();
    this.approveService.doGetMainTodoList(params).then(res => {
      let result = res.json() as any;
      if (result.icons && result.icons.length > 0) {
        this.icons = result.icons;
        console.log(this.icons)
      }
      setTimeout(() => { loading.dismiss(); }, 500)
    }).catch(err => {
      alert("getBpmTodo()@home.ts =>" + err);
      setTimeout(() => { loading.dismiss(); }, 500)
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
}
