import { LoadingService } from './../../providers/util/loading-service';
import { NcBillsDetailServiceProvider } from './../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { NcBillsDetailPage } from './../nc-bills-detail/nc-bills-detail';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { UserInfo } from "../../providers/constant/constant";
import xml2js from 'xml2js';
/**
NC审批列表页面
 */
@Component({
  selector: 'page-nc',
  templateUrl: 'nc.html',
})
export class NcPage {

  isShowSearch = false;
  approve: string = "todo";
  approveItemsTodo;
  approveItemsDone;
  pageTodo = 1;
  pageDone = 1;

  @ViewChild('search') searchbar: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billsdetailservice: NcBillsDetailServiceProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public loadingService: LoadingService,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    
  }
  ionViewDidEnter(){
    //初始化时，加载待办和已处理单据。
    this.getApprovesListTodo(1, "", "");
    this.getApprovesListDone(1, "", "");
  }

  //打开单据明细
  presentModal(itemId, billType, billState) {
    let modal = this.modalCtrl.create(NcBillsDetailPage, { itemId: itemId, billType: billType ,billState:billState});
    modal.onDidDismiss(data=>{
      if(data){
        this.getApprovesListTodo(1, "", "");
        this.getApprovesListDone(1, "", "");
      }
    });
    modal.present();
  }

  //设定搜索框是否可见
  searchBtnClick() {
    this.isShowSearch == true ? this.isShowSearch = false : this.isShowSearch = true;
  }
  //跟进搜索条件查找单据，默认先生50条
  getSearchItems(e) {
    if (this.approve == "todo") {
      this.getApprovesListTodo(1, 50, e)
    } else {
      this.getApprovesListDone(1, 50, e)
    }
    this.isShowSearch = false;
  }

  //无限滚动翻页方法
  doInfinite(e) {
    let params = new URLSearchParams();
    params.append("action", "1");
    if (this.approve == "todo") {
      this.pageTodo++;
      params.append("billState", "1");
    } else {
      this.pageDone++;
      params.append("billState", "2");
    }
    params.append("userState", "1");
    params.append("page", this.pageTodo.toString());
    params.append("pageCount", "10");
    this.billsdetailservice.doGetApproves(params).then(res => {
      let result;
      xml2js.parseString(res.text(), function (err, oresult) {
        result = oresult.response
      })
      if (result.sysMSG[0].tips[0] == "loginOK") {
        UserInfo.prototype.token = result.sysMSG[0].token;
        if (this.approve == "todo") {
          this.approveItemsTodo = this.approveItemsTodo.concat(result.datas[0].group[0].item);
        } else {
          this.approveItemsDone = this.approveItemsDone.concat(result.datas[0].group[0].item);
        }

      } else {
        console.log(result.sysMSG[0].tips[0])
      }
      e.complete();
    }).catch(err => {

    });
  }

  //加载待办单据
  getApprovesListTodo(page, pageCount, key) {
    this.loadingService.create('单据加载中，请稍候...',true,3000);

    let params = new URLSearchParams();
    params.append("action", "1");
    params.append("billState", "1");
    params.append("userState", "1");
    params.append("page", page);
    params.append("pageCount", pageCount ? pageCount : "10");
    params.append("Key", key);

    this.billsdetailservice.doGetApproves(params).then(res => {
      let result;
      xml2js.parseString(res.text(), function (err, oresult) {
        result = oresult.response
      })
      if (result.sysMSG[0].tips[0] == "loginOK") {
        UserInfo.prototype.token = result.sysMSG[0].token;
        if (result.datas[0].group) {
          this.approveItemsTodo = result.datas[0].group[0].item;
        } else {
          let toast = this.toastCtrl.create({
            message: '没有待办单据。',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      } else {
        console.log(result.sysMSG[0].tips[0])
      }
      this.loadingService.dismiss();
    }).catch(err => {
      this.loadingService.dismiss();
      alert("抱歉，您遇到一个错误，请截图后联系管理员！错误信息：getApprovesListTodo()@nc.ts =>" + err);
    });
  }

  //加载已处理单据
  getApprovesListDone(page, pageCount, key) {
    //this.loadingService.create('单据加载中，请稍候...',true,3000);
    
    let params = new URLSearchParams();
    params.append("action", "1");
    params.append("billState", "2");
    params.append("userState", "1");
    params.append("page", page);
    params.append("pageCount", pageCount ? pageCount : "10");
    params.append("Key", key);

    this.billsdetailservice.doGetApproves(params).then(res => {
      let result;
      xml2js.parseString(res.text(), function (err, oresult) {
        result = oresult.response
      })
      if (result.sysMSG[0].tips[0] == "loginOK") {
        UserInfo.prototype.token = result.sysMSG[0].token;
        if (result.datas[0].group) {
          this.approveItemsDone = result.datas[0].group[0].item;
        } else {
          // let toast = this.toastCtrl.create({
          //   message: '没有已处理单据。',
          //   duration: 3000,
          //   position: 'top'
          // });
          // toast.present();
        }
      } else {
        console.log(result.sysMSG[0].tips[0])
      }
     //this.loadingService.dismiss()
    }).catch(err => {
     //this.loadingService.dismiss()
      alert("抱歉，您遇到一个错误，请截图后联系管理员！错误信息：getApprovesListDone()@nc.ts =>" + err);
    });
  }
}
