import { SqlServiceProvider } from './../../providers/sql-service/sql-service';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { NoRightPage } from '../no-right/no-right';
import { GlobalVar } from '../../providers/constant/constant';
import { NcPage } from '../nc/nc';
import { NcBillsDetailServiceProvider } from '../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { URLSearchParams } from '@angular/http';
import { ListModifyPage } from '../list-modify/list-modify';

declare var cordova: any;

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons;
  iconsLength;
  allIcons;

  browserOption = {
    statusbar: {
      color: '#ffffffff'
    },
    toolbar: {
      height: 44,
      color: '#f0f0f0ff'
    },
    title: {
      color: '#003264ff',
      showPageTitle: true
    },
    closeButton: {
      wwwImage: 'assests/icon/x.png',
      wwwImagePressed: 'assests/icon/x.png',
      wwwImageDensity: 2,
      align: 'left',
    },
    backButtonCanClose: true
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sqlService: SqlServiceProvider,
    public approveService: NcBillsDetailServiceProvider
  ) {

  }

  ionViewDidEnter() {
    this.getIcons();
  }
  /**
   * 获取按钮
   */
  getIcons() {
    let params = new URLSearchParams();
    this.approveService.doGetMainAllIcons(params).then(res => {
      let result = res.json() as any;
      //获取按钮权限
      if (result.icons && result.icons.length > 0) {
        this.sqlService.execSql('select * from ICONS').then(ico => {
          if ((ico && ico.rows.length <= 0) ||ico == undefined) {
            //没有自定义按钮，使用服务器默认按钮
            let allIcons = result;
            let outputIcons = new Array();
            let outputAllIcons = new Array();
            if (allIcons && allIcons.icons.length > 0) {
              let servIcon = allIcons.icons;
              for (let j = 0; j < allIcons.icons.length; j++) {
                if (servIcon[j].right == 1) {
                  outputIcons.push(servIcon[j]);
                } else {
                  outputAllIcons.push(servIcon[j]);
                }
              }
              this.icons = outputIcons;
              this.allIcons = outputAllIcons;
              this.iconsLength = outputIcons.length;
            }
          } else {
            //有自定义按钮，使用自定义按钮
            //获取所有按钮，遍历自定义按钮，筛选出显示在首页的按钮。
            let allIcons = res.json();
            let outputIcons = new Array();
            let outputAllIcons = new Array();
            if (allIcons && allIcons.icons.length > 0) {
              let custIcon = ico.rows as any;
              let servIcon = allIcons.icons;
              for (let i = 0; i < custIcon.length; i++) {
                for (let j = 0; j < allIcons.icons.length; j++) {
                  if (custIcon.item(i).ID == servIcon[j].id) {
                    servIcon[j].right = custIcon.item(i).RIGHT
                    outputIcons.push(servIcon[j]);
                  } else {
                    outputAllIcons.push(servIcon[j]);
                  }
                }
              }
              this.icons = outputIcons;
              this.allIcons = servIcon;
              this.iconsLength = outputIcons.length;
            }
          }

        })
      }
    }).catch(err => {
      alert("getIcons()@list.ts =>" + err);
    });
  }

  //打开业务系统
  // navTo(action, url, label) {
  //   switch (action) {
  //     case 'initApprove':
  //       this.navCtrl.push(NcPage);
  //       break;
  //     case 'initH5ApproveSystem':
  //       if (label == "ＯＡ待办") {
  //         const browser = this.iab.create(url + '&type=main', '_blank', 'location=no');
  //       } else if (label == "公告新闻") {
  //         const browser = this.iab.create(url + '&type=newslist', '_blank', 'location=no');
  //       } else if (label == "业务审批") {
  //         const browser = this.iab.create(GlobalVar.bpm_server_address, '_blank', 'location=no');
  //       }
  //       break;
  //     default:
  //       this.navCtrl.push(NoRightPage);
  //   };
  // }

  navTo(action, url, label) {
    switch (action) {
      case 'initApprove':
        this.navCtrl.push(NcPage);
        break;
      case 'initH5ApproveSystem':
        if (label == "ＯＡ待办") {
          cordova.ThemeableBrowser.open(url + '&type=main', '_blank', this.browserOption);
        } else if (label == "公告新闻") {
          cordova.ThemeableBrowser.open(url + '&type=newslist', '_blank', this.browserOption);
        } else if (label == "业务审批") {
          cordova.ThemeableBrowser.open(GlobalVar.bpm_server_address, '_blank', this.browserOption);
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
