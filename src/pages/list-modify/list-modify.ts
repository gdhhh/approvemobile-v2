import { SqlServiceProvider } from './../../providers/sql-service/sql-service';
import {NcBillsDetailServiceProvider} from '../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list-modify',
  templateUrl: 'list-modify.html',
})
export class ListModifyPage {  
  icons;
  iconsLength;
  allIcons;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sqlService: SqlServiceProvider,    
    public approveService: NcBillsDetailServiceProvider
  ) {
  }

  ionViewDidLoad() {
    this.getIcons();
  }
  getIcons() {
    let params = new URLSearchParams();
    this.approveService.doGetMainAllIcons(params).then(res => {
      let result = res.json() as any;
      //获取按钮权限
      if (result.icons && result.icons.length > 0) {
        this.sqlService.execSql('select * from ICONS').then(ico => {
          if (ico && ico.rows.length <= 0) {
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
              this.allIcons = outputAllIcons;
              this.iconsLength = outputIcons.length;
            }
          }

        })
      }
    }).catch(err => {
      alert("getIcons()@list.ts =>" + err);
    });
  }

}
