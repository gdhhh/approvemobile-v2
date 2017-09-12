import {LoginPage} from '../login/login';

import { NcBillsDetailServiceProvider } from './../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { UserInfo } from './../../providers/constant/constant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import xml2js from 'xml2js';
import { ApproveModalPage } from "./approve-modal/approve-modal";

/**
NC审批单据详情页面
 */
@Component({
  selector: 'page-nc-bills-detail',
  templateUrl: 'nc-bills-detail.html'
})
export class NcBillsDetailPage {

  itemDetail;
  billTitle;
  billDetailInfo;
  billId;
  systemId;
  billState;
  isHistoryExpand = false;
  isDetailExpand = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public nav: NavController,
    public toastCtrl: ToastController,
    public billsdetailservice: NcBillsDetailServiceProvider
  ) {
  }

  ionViewDidLoad() {
    this.getApprovesItemDetail()
    this.billState = this.navParams.get('billState');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getApprovesItemDetail() {
    let loading = this.loadingCtrl.create({
      content:'数据加载中...'
    })
    loading.present();
    let params = new URLSearchParams();
    params.append("action", "2");
    params.append("billState", "1");
    params.append("userState", "1");
    params.append("billNo", this.navParams.get('itemId'));
    params.append("billType", this.navParams.get('billType'));
    this.billsdetailservice.doGetApproves(params).then(res => {
      let result;
      xml2js.parseString(res.text(), function (err, oresult) {
        result = oresult.response
      })
      if (result.sysMSG[0].tips[0] == "loginOK") {
        UserInfo.prototype.token = result.sysMSG[0].token;
        this.itemDetail = result.datas[0];
        this.billTitle = result.datas[0].billTitle;
        this.billId = result.datas[0].billId;
        this.systemId = result.datas[0].systemId;
        if (result.datas[0]!=" " && result.datas[0].billData[0].row) {
          this.getBillSubInfo(result.datas[0].billData[0].row);
        }else{
          let toast = this.toastCtrl.create({
            message: '无法打开单据，请联系管理员！',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.viewCtrl.dismiss();
        }
        console.log(result)
      } else {
        let toastfailed = this.toastCtrl.create({
          message: "审批秘钥超时失效，为了信息安全，请重新登录！",
          position: 'top'
        });
        toastfailed.present();
        setTimeout(() => { toastfailed.dismissAll(); }, 6000)
        setTimeout(() => { this.nav.setRoot(LoginPage);}, 500)
      }
      loading.dismiss();
    });
  }

  getBillSubInfo(rows) {
    let lines = new Array();
    for(var i in rows){
      if(rows[i].rowTitle == "详细信息"){
        let tabRows = rows[i].tab[0].row
        for(var j=0;j<tabRows.length;j++){
          if(tabRows[j].rowId[0].length==4){
            var obj = tabRows[j]
            obj.line1 = tabRows[j+1]
            obj.line2 = tabRows[j+2]
            j= j + 2;
            lines.push(obj)
          }
        }
      }
    }
    this.billDetailInfo = lines;
    console.dir(lines);
  }

  expandTab(tab) {
    if (tab == 'history') {
      this.isHistoryExpand == true ? this.isHistoryExpand = false : this.isHistoryExpand = true;
    } else if (tab == 'detail') {
      this.isDetailExpand == true ? this.isDetailExpand = false : this.isDetailExpand = true;
    }
  }

  openApproveModal(approveState) {
    let approveModal = this.modalCtrl.create(ApproveModalPage, { approveState: approveState, billId: this.billId, systemId: this.systemId }, { cssClass: 'inset-modal'});
    approveModal.onDidDismiss(data =>{
      let isRefresh = true;
      if(data == " 审批成功！"|| data == " 驳回成功！"){
        this.viewCtrl.dismiss(isRefresh);
      }
    })
    approveModal.present();
}

}
