import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';


/**
 * Generated class for the CoremailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var  cordova : any;

@Component({
  selector: 'page-coremail',
  templateUrl: 'coremail.html',
})
export class CoremailPage {

  constructor(
    public navCtrl: NavController, 
    private themeableBrowser: ThemeableBrowser,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoremailPage');
    cordova.ThemeableBrowser.open('http://apache.org', '_blank', {
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
      backButtonCanClose: true
  }).addEventListener('backPressed', function(e) {
      alert('back pressed');
  }).addEventListener('helloPressed', function(e) {
      alert('hello pressed');
  }).addEventListener('sharePressed', function(e) {
      alert(e.url);
  }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
      console.error(e.message);
  }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
      console.log(e.message);
  });
  }

  

}
