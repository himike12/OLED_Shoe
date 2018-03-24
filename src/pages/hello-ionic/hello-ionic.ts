import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from "@ionic-native/camera"; 
import 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
})

export class HelloIonicPage {
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  
  captureDataUrl: string;
  alertCtrl: AlertController;
  captureImageUrl: string;
  
  constructor(public camera: Camera, public navCtrl: NavController, alertCtrl: AlertController) {
    //firebase.initializeApp(FIREBASE_CONFIG);
    this.alertCtrl = alertCtrl;
    this.camera = camera;
  }


  takePhoto() {
    //Defining Camera options

    const options: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      targetWidth: 1200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((ImageData) => {
      console.log(ImageData);
      this.captureDataUrl = 'data:image/jpeg;base64,' + ImageData;
      //console.log(this.captureDataUrl);
    }, (err) => {
      
    });
  }

  upload() {
    let storageRef = firebase.storage().ref();

    // Create a timestamp as filename
    const filename = 'images/' + Math.floor(Date.now() / 1000) + '.jpeg';

    // Create a reference to 'images/todays-date.jpeg'
    const imageRef = storageRef.child(filename);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      // Show an alert when image is successfully uploaded
      this.showSuccesfulUploadAlert();
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
    this.captureDataUrl = "";
  }
  
  selectedImages = [];
  
  selector(img) {
    


    this.selectedImages.push(img);
    //this.ImageData = img;
    this.uploadImageToPlaylist(img);
    //this.selectedImages = [];
  }

  uploadImageToPlaylist(img) {
      
  }


  getDataUri(url, callback) {

  }
}
