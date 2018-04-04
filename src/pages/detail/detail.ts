import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AlertController } from 'ionic-angular';

const BLEUART_SERVICE = '6E400001-B5A3-F393-­E0A9-­E50E24DCCA9E';
const BLEUART_CHARACTERISTIC = '0x0002';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  peripheral: any = {};
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private ble: BLE,
              private toastCtrl: ToastController,
              private ngZone: NgZone,
            private alertCtrl: AlertController) {

    let device = navParams.get('device');
    this.setStatus('Connecting to ' + device.name || device.id);

    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );

  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('Connected to ' + peripheral.name);
      this.peripheral = peripheral;
    });
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  disconnect() {
    this.ble.disconnect(this.peripheral.id).then(
      
    )
    this.setStatus('Disconnected from ' + this.peripheral.name);
  }
  alert(){
    var buffer = this.stringToBytes('2hello');
    //this.ble.write(this.peripheral.id, BLEUART_SERVICE, BLEUART_CHARACTERISTIC, buffer).then(
      //() => this.setStatus('Sent 2hello to the BLEUART'),
     // e => this.showAlert('Unexpected Error', 'Error sending 2hello' + e)
    //);
  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
 }
 showAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['OK']
  });
  alert.present();
}

}