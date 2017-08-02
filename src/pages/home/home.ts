import { OaPage } from './../oa/oa';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AnimationBuilder, AnimationService } from "css-animator";
import { InAppBrowser } from "@ionic-native/in-app-browser";




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('slider') slider: Slides;
  @ViewChild('myElement') myElem;
  private animator: AnimationBuilder;

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
    animationService: AnimationService,
    private iab: InAppBrowser
  ) {
    this.animator = animationService.builder();
  }

  //用户滑动图片后 图片继续自动播放
  autoPlay() {
    this.slider.startAutoplay();
  }

  clickButton() {
    const browser = this.iab.create('http://mjoa.nimble.cn/', '_blank', 'location=no');
    browser.insertCSS({ code: "body{font-size: 250px;" });
  }


  itemClick() {
    console.log("itemclick")
  }
  animateElem() {
    this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }

  navToPage(pageId) {
    this.navCtrl.push(OaPage);
  }


}
