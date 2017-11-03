import { AppVersion } from '@ionic-native/app-version';
import { SecurityPage } from './../pages/security/security';
import { ToastService } from './../providers/util/toast-service';
import { LoadingService } from './../providers/util/loading-service';
import { DateToLocaleDateStringPipe } from './../pipes/DatetoLocaleDateString/DatetoLocaleDateString';
import { ForbiddenValidatorDirective } from '../shared/forbidden-string.directive';
import { NoRightPage } from './../pages/no-right/no-right';
import { NcBillsDetailPage } from './../pages/nc-bills-detail/nc-bills-detail';
import { ApproveModalPage } from './../pages/nc-bills-detail/approve-modal/approve-modal';
import { NcPage } from './../pages/nc/nc';
import { LoginPage } from './../pages/login/login';
import { InfoPage } from './../pages/info/info';
import { TabsPage } from './../pages/tabs/tabs';
import { HttpModule } from '@angular/http';
import { OaPage } from './../pages/oa/oa';
import { SplashPage } from './../pages/splash/splash';
import { ExpandableHeader } from './../components/expandable-header/expandable-header';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ListModifyPage } from '../pages/list-modify/list-modify';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';

import { Toast } from '@ionic-native/toast';


import { LoginServiceProvider } from './../providers/login-service/login-service';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { NcBillsDetailServiceProvider } from '../providers/nc-bills-detail-service/nc-bills-detail-service';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';

import { NoticeCreateTimePipe } from '../pipes/notice-create-time/notice-create-time';
import { SubjectPipe } from '../pipes/subject/subject';
import { CoremailPage } from '../pages/coremail/coremail';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ListModifyPage,
    OaPage,
    ExpandableHeader,
    SplashPage,
    TabsPage,
    InfoPage,
    LoginPage,
    NcPage,
    NoRightPage,
    NcBillsDetailPage,
    ForbiddenValidatorDirective,
    SubjectPipe,
    ApproveModalPage,
    SecurityPage,
    CoremailPage,
    DateToLocaleDateStringPipe,
    NoticeCreateTimePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SplashPage,
    OaPage,
    TabsPage,
    InfoPage,
    LoginPage,
    NcPage,
    NoRightPage,
    ApproveModalPage,
    SecurityPage,
    NcBillsDetailPage,
    ListPage,
    CoremailPage,
    ListModifyPage
  ],
  providers: [
    StatusBar,
    Device,
    Toast,
    SplashScreen,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginServiceProvider,
    HomeServiceProvider,
    NcBillsDetailServiceProvider,
    LoadingService,
    ToastService,
    FileOpener,
    AppVersion,
    FileTransfer,
    SQLite,
    FileTransferObject,
    File
  ]
})
export class AppModule { }
