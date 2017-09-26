import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

    toast: Toast;
    constructor(public toastCtrl: ToastController) { }

    create(message, notHasDuration = false, duration = 3000, position = 'bottom') {
        if (this.toast) {
            this.toast.dismiss();
        }

        this.toast = this.toastCtrl.create({
            message: message,
            duration: notHasDuration ? null : duration,
            position: position,
            showCloseButton: notHasDuration,
            closeButtonText: 'OK'
        });
        this.toast.present();
    }

    dismiss(){
        this.toast.dismiss();
    }
}