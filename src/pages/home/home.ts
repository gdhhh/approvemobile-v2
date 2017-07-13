import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { AnimationBuilder, AnimationService } from "css-animator";

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


  constructor(public navCtrl: NavController, animationService: AnimationService) {
    this.animator = animationService.builder();
  }

  itemClick(){
    console.log("itemclick")
  }
   animateElem() {
    this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }
 

}
