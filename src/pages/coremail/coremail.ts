import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the CoremailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-coremail',
  templateUrl: 'coremail.html',
})
export class CoremailPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoremailPage');
  }

}
