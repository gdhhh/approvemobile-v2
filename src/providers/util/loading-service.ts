import { Loading, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';


@Injectable()
export class LoadingService{
    loading : Loading;

    constructor(
        public loadingCtrl: LoadingController
    ){}

    create(message, ok=false, duration){
        if(!duration){
            duration = 3000
        }
        if(this.loading){
            this.loading.dismiss();
        }

        this.loading = this.loadingCtrl.create({
            content: message,
            duration: ok ? null : duration
        });
        this.loading.present();
    }
    dismiss(){
        this.loading.dismiss();
    }
}