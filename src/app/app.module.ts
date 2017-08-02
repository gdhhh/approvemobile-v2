import { InfoPage } from './../pages/info/info';
import { TabsPage } from './../pages/tabs/tabs';
import {HttpModule} from '@angular/http';
import { OaPage } from './../pages/oa/oa';
import { SplashPage } from './../pages/splash/splash';
import { ExpandableHeader } from './../components/expandable-header/expandable-header';
import { AnimationService, AnimatesDirective } from 'css-animator';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';

import { Toast } from '@ionic-native/toast';


import { LoginServiceProvider } from './../providers/login-service/login-service';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    OaPage,
    ExpandableHeader,
    SplashPage,
    TabsPage,
    InfoPage,
    AnimatesDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SplashPage,
    OaPage,
    TabsPage,
    InfoPage,
    ListPage
  ],
  providers: [
    StatusBar,
    Device,
    Toast,
    SplashScreen,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AnimationService,
    LoginServiceProvider
  ]
})
export class AppModule {}
