import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OaPage } from './oa';

@NgModule({
  declarations: [
    OaPage,
  ],
  imports: [
    IonicPageModule.forChild(OaPage),
  ],
  exports: [
    OaPage
  ]
})
export class OaPageModule {}
