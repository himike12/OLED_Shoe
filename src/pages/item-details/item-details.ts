import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { NavController, NavParams, AlertController } from 'ionic-angular';
//import { FileChooser, FilePath, File } from 'ionic-native';
//import { File } from '@ionic-native/file';
//import { FileChooser } from '@ionic-native/file-chooser';
//import {FilePath } from '@ionic-native/file-path';
import 'rxjs';

//import { AngularFireModule } from 'angularfire2';
//import { AngularFireDatabase } from 'angularfire2/database';
//import { FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase';
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  base64Image: any;
  imageURL: string;
  alertCtrl: AlertController;
  
  constructor(public camera: Camera, alertCtrl: AlertController) {
    this.alertCtrl = alertCtrl;
    this.camera = camera;
  }
  accessGallery(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
     }).then((imageData) => {
       this.base64Image = 'data:image/jpeg;base64,'+imageData;
      }, (err) => {
       console.log(err);
     });
  }
  
  upload() {
        let storageRef = firebase.storage().ref();
        // Create a timestamp as filename
        const filename = 'images/' + Math.floor(Date.now() / 1000) + '.jpeg';
        // Create a reference to 'images/todays-date.jpeg'
        const imageRef = storageRef.child(filename);
        imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        // Show an alert when image is successfully uploaded
        this.showSuccesfulUploadAlert();
        imageRef.getDownloadURL().then(function (url) {
            this.imageURL = url;
        }).then((imageURL) => {
            const link = firebase.storage().ref(this.imageURL);
            link.putString(this.imageURL, 'image-url');
        });
    });
  }
  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Uploaded!',
      subTitle: 'Picture is uploaded to Firebase',
      buttons: ['OK']
    });
    alert.present();
    // clear the previous photo data in the variable
    this.base64Image = "";
  }
}
