import { HomeServiceProvider } from './../../providers/home-service/home-service';
import { GlobalVar } from './../../providers/constant/constant';
import { OaPage } from './../oa/oa';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { InAppBrowser } from "@ionic-native/in-app-browser";




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('slider') slider: Slides;
  @ViewChild('noticSlider') noticSlider: Slides;
  @ViewChild('myElement') myElem;

  noticeSlide1;
  noticeSlide2;
  noticeSlide3;

  private serveradd = GlobalVar.server_address;
  slides = [
    {
      imageUrl: "assets/img/banner/pic1.jpg",
      private: false
    },
    {
      imageUrl: "assets/img/banner/pic2.jpg",
      private: false
    },
    {
      imageUrl: "assets/img/banner/pic3.jpg",
      private: true
    }
  ]

  constructor(
    public navCtrl: NavController,
    private homeservice: HomeServiceProvider,
    private iab: InAppBrowser
  ) { }

  ionViewDidLoad() {
    this.homeservice.getTopNotice().then(res => {
      if (res) {
        let list1 = new Array();
        let list2 = new Array();
        let list3 = new Array();
        for (var i = 0; i < res.length; i++) {
          if (i < 3) { list1.push(res[i]) }
          if (i >= 3 && i < 6) { list2.push(res[i]) }
          if (i >= 6 && i < 10) { list3.push(res[i]) }
        }
        this.noticeSlide1 = list1;
        this.noticeSlide2 = list2;
        this.noticeSlide3 = list3;
      }
    })
  }

  //用户滑动图片后 图片继续自动播放
  autoPlay() {
    this.slider.startAutoplay();
  }

  openNotice(fdid) {
    this.noticSlider.stopAutoplay();
    const browser = this.iab.create(this.serveradd + 'LandRayOA?username=tangwl&type=1&fdid='+fdid, '_blank', 'location=no');
    console.log(browser)
  }

  navToOA() {
    const browser = this.iab.create(this.serveradd + 'LandRayOA?username=tangwl&type=0', '_blank', 'location=no');
    console.log(browser)
  }
  navToBPM() {
    const browser = this.iab.create('http://www.baidu.com', '_blank', 'location=no');
    console.log(browser)
  }

  itemClick() {
    console.log("itemclick")
  }

  navToPage(pageId) {
    this.navCtrl.push(OaPage);
  }


}
