import { ToastService } from './../../providers/util/toast-service';
import { LoadingService } from './../../providers/util/loading-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {LoginPage} from '../login/login';

import { NcBillsDetailServiceProvider } from './../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { UserInfo, GlobalVar } from './../../providers/constant/constant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import xml2js from 'xml2js';
import { ApproveModalPage } from "./approve-modal/approve-modal";
import { FileOpener } from '@ionic-native/file-opener'
import { Device } from "@ionic-native/device";

import {URLSearchParams} from '@angular/http';

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
  isDetailExpand = true;
  isAttacheExpand = true ;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public loadingService: LoadingService,
    public modalCtrl: ModalController,
    public nav: NavController,
    public toastCtrl: ToastController,
    public taostService: ToastService,
    public fileOpener: FileOpener,
    public transfer: FileTransfer,
    public file:File,
    public device: Device,
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
    } else if (tab == 'attache') {
      this.isAttacheExpand == true ? this.isAttacheExpand = false : this.isAttacheExpand = true;
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
//测试用 打开文档

openfiles(filename,fileId){
    this.loadingService.create("正在为您打开附件，请稍候...",false,true);
    const fileTransfer: FileTransferObject = this.transfer.create();
    debugger;
    let contentName;
    let contentType;
    if(filename){
      let lowerFileName = filename[0].toLowerCase();
      if(lowerFileName.indexOf(".pdf")>0){
        contentName = "file.pdf";
        contentType = "application/pdf";
      }else if(lowerFileName.indexOf(".docx")>0){
        contentName = "file.docx";
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }else if(lowerFileName.indexOf(".xlsx")>0){
        contentName = "file.xlsx";
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }else if(lowerFileName.indexOf(".pptx")>0){
        contentName = "file.pptx";
        contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      }else if(lowerFileName.indexOf(".doc")>0){
        contentName = "file.doc";
        contentType = "application/msword";
      }else if(lowerFileName.indexOf(".xls")>0){
        contentName = "file.xls";
        contentType = "application/vnd.ms-excel";
      }else if(lowerFileName.indexOf(".ppt")>0){
        contentName = "file.ppt";
        contentType = "application/vnd.ms-powerpoint";
      }else if(lowerFileName.indexOf(".jpg")>0){
        contentName = "file.jpg";
        contentType = "image/jpeg";
      }else if(lowerFileName.indexOf(".png")>0){
        contentName = "file.png";
        contentType = "image/png";
      }
    }
    let param = new URLSearchParams();
    param.append("fileName",filename);
    param.append("fileId",fileId);
    param.append("contentName",contentName);
    this.billsdetailservice.doGetFile(param).then(res=>{
      if(res.result ==true){
        //let url = GlobalVar.server_address + "attachment/"+ fileId +filename;
        let url = GlobalVar.server_address + "attachment/"+ fileId + contentName;
        let savePath = '';
        if(this.device.platform == 'iOS'){
          savePath = this.file.cacheDirectory;
        }else if (this.device.platform =='Android'){
          savePath = this.file.externalDataDirectory;
        }
        fileTransfer.download(url,savePath+contentName).then((entry) =>{
            console.log(entry.toURL());
            this.fileOpener.open( entry.toURL(),contentType)
            .then(()=> {
              setTimeout(()=>{
                this.loadingService.dismiss();
              },1500)   
            })
            .catch(e=>console.log("error："+e));
          }, (error) => {
            console.log(error);
            this.loadingService.dismiss();
          }
        ).catch();
      }else{
        this.loadingService.dismiss();
        this.taostService.create("抱歉，移动门户暂时无法为您打开此附件，请在登录PC门户查看。");
      }
    });

    
  }

}
