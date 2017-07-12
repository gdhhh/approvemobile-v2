import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('slider') slider: Slides;

  slides = [
    {
      imageUrl: "assets/img/background/bg-1.png",
      private: false
    },
    {
      imageUrl: "assets/img/background/bg-3.png",
      private: false
    },
    {
      imageUrl: "assets/img/background/bg-5.png",
      private: true
    },
    {
      imageUrl: "assets/img/background/bg-7.png",
      private: true
    }
  ]


  constructor(public navCtrl: NavController) {
  }

 

}
