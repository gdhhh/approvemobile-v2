import { Component, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeader {

  @Input('scrollArea') scrollArea: any;
  @Input('headerHeight') headerHeight: number;

  newHeaderHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer) {

  }

  // ngOnInit(){
  //   this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
  //   this.scrollArea.ionScroll.subscribe((ev) => {
  //     this.resizeHeader(ev);
  //     debugger;
  //     console.log("this.resizeHeader(ev)")
  //   });
 
  // }

  ionViewDidEnter() {
    console.log("fire")
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');    
    this.scrollArea.enableScrollListener();
    this.scrollArea.ionScroll.subscribe(($event: any) => {
      this.resizeHeader($event);
       //console.log($event)
    });
 }

  resizeHeader(ev){
 
    ev.domWrite(() => {
 
      this.newHeaderHeight = this.headerHeight - ev.scrollTop;
 
      if(this.newHeaderHeight < 0){
        this.newHeaderHeight = 0;
      }   
 
      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
      console.log("height="+this.newHeaderHeight)
      for(let headerElement of this.element.nativeElement.children){
 
        let totalHeight = headerElement.offsetTop + headerElement.clientHeight;
 
        if(totalHeight > this.newHeaderHeight && !headerElement.isHidden){
          headerElement.isHidden = true;
          this.renderer.setElementStyle(headerElement, 'opacity', '0');
        } else if (totalHeight <= this.newHeaderHeight && headerElement.isHidden) {
          headerElement.isHidden = false;
          this.renderer.setElementStyle(headerElement, 'opacity', '0.7');
        }
 
      }
 
    });
 
  }

  // ngOnInit() {

  //   this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

  //   this.scrollArea.ionScroll.subscribe((ev) => {
  //     this.resizeHeader(ev);
  //   });

  // }

  // resizeHeader(ev) {

  //   ev.domWrite(() => {

  //     if(ev.scrollTop <= 0){
  //       this.renderer.setElementClass(this.element.nativeElement,'expandable-header-show',true)
  //       this.renderer.setElementClass(this.element.nativeElement,'expandable-header-hide',false)
  //       //this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
  //     }else{
  //       this.renderer.setElementClass(this.element.nativeElement,'expandable-header-hide',true)
  //       this.renderer.setElementClass(this.element.nativeElement,'expandable-header-show',false)
  //       //this.renderer.setElementStyle(this.element.nativeElement, 'height', '0px');
  //     }

      //this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      // if (this.newHeaderHeight < 0) {
      //   this.newHeaderHeight = 0;
      // }

      //this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
 
      // for (let headerElement of this.element.nativeElement.children) {

      //   let totalHeight = headerElement.offsetTop + headerElement.clientHeight;

      //   if (totalHeight > this.newHeaderHeight && !headerElement.isHidden) {
      //     headerElement.isHidden = true;
      //     //this.renderer.setElementStyle(headerElement, 'opacity', '1');
      //   } else if (totalHeight <= this.newHeaderHeight && headerElement.isHidden) {
      //     headerElement.isHidden = false;
      //     //this.renderer.setElementStyle(headerElement, 'opacity', '1');
      //   }

      // }

  //   });

  // }

}