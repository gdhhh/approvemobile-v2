import { ListPage } from '../list/list';
import { ToastService } from './../../providers/util/toast-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Device } from '@ionic-native/device';
import { URLSearchParams, Http, Headers } from '@angular/http';
import { NcBillsDetailPage } from '../nc-bills-detail/nc-bills-detail';
import { NoRightPage } from './../no-right/no-right';
import { NcBillsDetailServiceProvider } from './../../providers/nc-bills-detail-service/nc-bills-detail-service';
import { NcPage } from './../nc/nc';
import { HomeServiceProvider } from './../../providers/home-service/home-service';
import { GlobalVar, UserInfo } from './../../providers/constant/constant';
import { OaPage } from './../oa/oa';
import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { NavController, Slides, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

import { Events } from 'ionic-angular';

import xml2js from 'xml2js';

import 'rxjs/add/operator/map';
import { CoremailPage } from '../coremail/coremail';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('slider') slider: Slides;
  @ViewChild('noticSlider') noticSlider: Slides;
  @ViewChild('myElement') myElem;
  @ViewChild('mycontent') scrollArea: any;
  @ViewChild('expandheader') expandheader: any;

  noticeSlide1;
  noticeSlide2;
  noticeSlide3;

  icons;
  iconsLength;
  oaTodoList;
  bpmTodoList;
  shortcutList;
  isShowMainItemList;
  isShowBpmItemList;

  isInitBpm = false;
  isInitOa = false;

  headerHeight = 150;
  newHeaderHeight: any;

  browserOption = {
    backButtonCanClose: true,
    statusbar: {
      color: '#ffffffff'
    },
    toolbar: {
      height: 44,
      color: '#ffffffff'
    },
    title: {
      color: '#003264ff',
      showPageTitle: true
    },
    backButton: {
      image: 'back',
      imagePressed: 'back_pressed',
      align: 'left',
      event: 'backPressed'
    },
    closeButton: {
      image: 'close',
      imagePressed: 'close_pressed',
      align: 'left',
      event: 'closePressed'
    },
    browserProgress: {
      showProgress: true,
      progressBgColor: "#007e9c",
      progressColor: "#FF5E00"
    }
  }


  private serveradd = GlobalVar.server_address;
  slides = [
    {
      imageUrl: this.serveradd + "images/banner/pic1.jpg",
      private: false
    },
    {
      imageUrl: this.serveradd + "images/banner/pic2.jpg",
      private: false
    },
    {
      imageUrl: this.serveradd + "images/banner/pic3.jpg",
      private: true
    }
  ]

  constructor(
    public navCtrl: NavController,
    private homeservice: HomeServiceProvider,
    private approveService: NcBillsDetailServiceProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastService,
    public renderer: Renderer,
    public element: ElementRef,
    private device: Device,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public http: Http,
    public sqlite: SQLite,
    public events: Events,
    private themeableBrowser: ThemeableBrowser,
    public modalCtrl: ModalController
  ) {
    events.subscribe('reload:data', () => {
      this.getMainTodo();
    })
  }

  ionViewDidLoad() {
    this.homeservice.getTopNotice().then(res => {
      if (res) {
        console.log(res)
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
    });

    //创建sqlite数据库读存用户配置数据
    // this.sqlite.create({
    //   name: 'data.db',
    //   location: 'default'
    // }).then((db: SQLiteObject) => {
    //   db.executeSql('create table if not exists UserIcons (actionClick,imageSrc,lable,oSystemUser,tips,url,rightId)', {})
    //     .then(() => console.log('执行SQL语句'))
    //     .catch(e => console.log(e))
    // }).catch(e => console.log(e))

  }
  ionViewDidEnter() {
    this.getMainTodo();
    this.isShowMainItemList = false;
    setTimeout(() => {
      this.scrollArea.resize();
      this.isShowMainItemList = true;
    }, 1000)
  }

  /**
   * 加载首页待办列表数据
   */
  getMainTodo() {
    let params = new URLSearchParams();
    this.approveService.doGetMainTodoList(params).then(res => {
      let result = res.json() as any;
      //获取按钮权限
      if (result.icons && result.icons.length > 0) {
        this.icons = result.icons;
        this.iconsLength = this.icons.length;
      }
      //获取代办列表
      if (result.dataList && result.dataList.length > 0) {
        this.shortcutList = result.dataList;
        console.log(this.shortcutList)
      }
    }).catch(err => {
      alert("getMainTodo()@home.ts =>" + err);
    });
  }

  //打开第三方系统
  /**
   * 首页按钮触发跳转函数
   * @param action 按钮的处理类型
   * @param url 按钮的跳转URL
   * @param label 按钮名称
   */
  navTo(action, url, label) {
    switch (action) {
      case 'initApprove':
        this.navCtrl.push(NcPage);
        break;
      case 'initH5ApproveSystem':
        if (label == "ＯＡ待办") {
          if (this.device.platform == "Android") {
            const browser: ThemeableBrowserObject = this.themeableBrowser.create(url + '&type=main', '_blank', this.browserOption);
            //返回刷新首页的数据
            browser.on('exit').subscribe(() => {
              this.getMainTodo();
            })
            browser.on('loadstart').subscribe((event) => {
              window['plugins'].toast.showLongCenter("加载系统数据中，请稍候...", 3000);
              let newUrl = event.url;
              const fileTransfer: FileTransferObject = this.transfer.create();
              if (newUrl && newUrl.indexOf("readDownload") > 0) {
                window['plugins'].toast.showLongCenter("加载附件中，请稍候...", 4000);
                this.http.get(newUrl).toPromise().then(response => {
                  let res = response as any;
                  console.log(response);
                  console.log(res.headers);
                  if (res.headers._headers.get("content-disposition")) {
                    var startIdx = res.headers._headers.get("content-disposition")[0].indexOf('filename=') + 10;
                    var endIdx = res.headers._headers.get("content-disposition")[0].length - 1;
                    var splitstring = res.headers._headers.get("content-disposition")[0].split('.');
                    var extention = splitstring[splitstring.length - 1].replace('"', '');
                    fileTransfer.download(newUrl, "file:///storage/emulated/0/Download/OAfiles." + extention).then((entry) => {
                      console.log('download complete: ' + entry.toURL());
                      setTimeout(() => {
                        window['plugins'].toast.showLongCenter("正在打开附件，请稍候...", 4000);
                        this.fileOpener.open(entry.toURL(), res.headers._headers.get("content-type")[0])
                          .then(() => {
                            this.toastCtrl.dismiss();
                          })
                          .catch(e => {
                            this.toastCtrl.dismiss();
                            window['plugins'].toast.showLongCenter("打开失败");
                          })
                      }, 500)

                    }, (error) => {
                      // handle error
                      console.log(error)
                    });
                  }
                })
              }
            })
          } else {
            const browser: ThemeableBrowserObject = this.themeableBrowser.create(url + '&type=main', '_blank', this.browserOption);
            //返回刷新首页数据
            browser.on('exit').subscribe(() => {
              this.getMainTodo();
            })
          }
        } else {
          const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', this.browserOption);
          // 返回刷新首页数据
          browser.on('exit').subscribe(() => {
            this.getMainTodo();
          })
        } 
        // else if (label == "业务审批") {
        //   const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', this.browserOption);
        //   // 返回刷新首页数据
        //   browser.on('exit').subscribe(() => {
        //     this.getMainTodo();
        //   })
        // } else if (label == "企业邮箱") {
        //   const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', this.browserOption);
        //   //返回刷新首页数据
        //   browser.on('exit').subscribe(() => {
        //     this.getMainTodo();
        //   })
        // }else if (label == "总裁桌面") {
        //   const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', this.browserOption);
        //   //返回刷新首页数据
        //   browser.on('exit').subscribe(() => {
        //     this.getMainTodo();
        //   })
        // }
        break;
      default:
        this.navCtrl.push(NoRightPage);
    };
  }

  /**
   * 打开OA公告方法
   * @param fdid 公告ID
   */
  openNotice(fdid) {
    //停止公告滚动
    this.noticSlider.stopAutoplay();
    //打开浏览器
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(this.serveradd + 'LandRayOA?username=' + UserInfo.prototype.userid + '&type=1&fdid=' + fdid, '_blank', this.browserOption);
  }


  //处理各系统单一待办方法

  /**
   * 主页待办列表事件处理
   * @param item 
   */
  openMainTodo(item) {
    switch (item.actionClick) {
      case 'initApprove':
        this.presentNcModal(item.itemId, item.billType);
        break;
      case 'initH5ApproveSystem':
        if (item.lable == "ＯＡ待办") {
          //触发并缓存单点登录信息
          if (this.icons) {
            for (var i in this.icons) {
              if (!this.isInitOa && this.icons[i].lable == "ＯＡ待办") {
                let opt = { hidden: true };
                const browser: ThemeableBrowserObject = this.themeableBrowser.create(this.icons[i].url, '_blank', this.browserOption);
                //单点登录处理成功后访问待办
                browser.on('loadstop').subscribe(() => {
                  this.openOaTodo(item.url);
                })
              }
            }
          }
        } else if (item.lable == "业务审批") {
          //触发并缓存单点登录信息
          if (this.icons) {
            for (var i in this.icons) {
              if (!this.isInitBpm && this.icons[i].lable == "业务审批") {
                let opt = { hidden: true };
                const browser: ThemeableBrowserObject = this.themeableBrowser.create(this.icons[i].url, '_blank', this.browserOption);
                //单点登录处理成功后访问待办
                browser.on('loadstop').subscribe(() => {
                  this.openBpmTodo(item.itemId);
                })
              }
            }
          }
        }
        break;
      default:
        this.navCtrl.push(NoRightPage);
    };
  }
  /**
   * 打开NC单据查看明细
   * @param itemId NC单据ID
   * @param billType NC单据类型
   */
  presentNcModal(itemId, billType) {
    //以modal的形式打开
    let modal = this.modalCtrl.create(NcBillsDetailPage, { itemId: itemId, billType: billType, billState: 1 });
    modal.present();
  }

  /**
   * 打开BPM待办
   * @param id BPM单据ID
   */
  openBpmTodo(id) {
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(GlobalVar.bpm_server_address + 'jwf/mobile/bpm/task.html?taskId=' + id, '_blank', this.browserOption);
    //退出待办刷新首页数据
    browser.on('exit').subscribe(() => {
      this.getMainTodo();
    })
  }

  /**
   * 打开OA待办
   * @param url OA待办URL
   */
  openOaTodo(url) {
    if (this.device.platform == "Android") {
      const browser: ThemeableBrowserObject = this.themeableBrowser.create(GlobalVar.oa_server_address + url, '_blank', this.browserOption);
      browser.on('exit').subscribe(() => {
        this.getMainTodo();
      })
      browser.on('loadstart').subscribe((event) => {
        window['plugins'].toast.showLongCenter("加载系统数据中，请稍候...", 3000);
        let newUrl = event.url;
        const fileTransfer: FileTransferObject = this.transfer.create();
        if (newUrl && newUrl.indexOf("readDownload") > 0) {
          debugger;
          window['plugins'].toast.showLongCenter("加载附件中，请稍候...", 4000);
          this.http.get(newUrl).toPromise().then(response => {
            let res = response as any;
            console.log(response);
            console.log(res.headers);
            if (res.headers._headers.get("content-disposition")) {
              var startIdx = res.headers._headers.get("content-disposition")[0].indexOf('filename=') + 10;
              var endIdx = res.headers._headers.get("content-disposition")[0].length - 1;
              var splitstring = res.headers._headers.get("content-disposition")[0].split('.');
              var extention = splitstring[splitstring.length - 1].replace('"', '');
              fileTransfer.download(newUrl, "file:///storage/emulated/0/Download/OAfiles." + extention).then((entry) => {
                console.log('download complete: ' + entry.toURL());
                setTimeout(() => {
                  window['plugins'].toast.showLongCenter("正在打开附件，请稍候...", 4000);
                  this.fileOpener.open(entry.toURL(), res.headers._headers.get("content-type")[0])
                    .then(() => {
                      this.toastCtrl.dismiss();
                    })
                    .catch(e => {
                      this.toastCtrl.dismiss();
                      window['plugins'].toast.showLongCenter("打开失败");
                    })
                }, 500)
              }, (error) => {
                console.log(error)
              });
            }
          })
        }
      })
    } else {
      //IOS端 处理方式
      const browser: ThemeableBrowserObject = this.themeableBrowser.create(GlobalVar.oa_server_address + url, '_blank', this.browserOption);
      //返回刷新首页数据
      browser.on('exit').subscribe(() => {
        this.getMainTodo();
      })
    }
  }

  /**
   * 更多应用 处理函数
   */
  navToMoreApp() {
    this.navCtrl.push(ListPage);
  }

  /**
   * 用户滑动图片后 图片继续自动播放
   */
  autoPlay() {
    this.slider.startAutoplay();
  }

  /**
   * slider监听
   * @param index 页码
   */
  slideChanged(index) {
    this.noticSlider.slideTo(1);
  }
  navToMail() {
    this.navCtrl.push(CoremailPage)
  }
}



