import {NcBillsDetailServiceProvider} from '../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list-modify',
  templateUrl: 'list-modify.html',
})
export class ListModifyPage {  
  icons;
  allIcons;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public approveService: NcBillsDetailServiceProvider
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
        if(localStorage.getItem("icons")){
          this.icons = localStorage.getItem("icons");
        }else{
          this.icons = result.icons;
        }
        this.allIcons = result.icons;
      }
    }).catch(err => {
      alert("getIcons()@list-modify.ts =>" + err);
    });
  }

}
