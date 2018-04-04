import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from "@ionic-native/camera"; 
import 'rxjs';
import * as firebase from 'firebase';

//import { AngularFireModule } from 'angularfire2';
//import { AngularFireDatabase } from 'angularfire2/database';
//import { FirebaseListObservable } from 'angularfire2/database';
import { NgZone } from '@angular/core';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})

export class HelloIonicPage {
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  imageURL: string;
  captureDataUrl: string;
  alertCtrl: AlertController;
  captureImageUrl: string;
  imgsource: any;
  items=[];
  //imgs=[];
  
  firedbRef: firebase.database.Reference = firebase.database().ref('/images');
  
  
  constructor(public camera: Camera, public navCtrl: NavController, alertCtrl: AlertController, public zone: NgZone) {
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
  
    //const firedbRef: firebase.database.Reference = firebase.database.list('/images');
  
    let storageRef = firebase.storage().ref();

    // Create a timestamp as filename
    const filename = 'images/' + Math.floor(Date.now() / 1000) + '.jpeg';
    
    
    
    // Create a reference to 'images/todays-date.jpeg'
    const imageRef = storageRef.child(filename);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      //this.firedbRef.set(filename);
      this.firedbRef.push(filename);
    
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
  
  display() {
    //let storageRef = firebase.storage().ref();
    //storageRef.child('images/1522731583.jpeg').getDownloadURL().then((url) => {
     // this.zone.run(() => {
    //    this.imgsource = url;
    //    console.log(url);
    //   })
    //})
    
    let storageRef = firebase.storage().ref();
    
    this.firedbRef.on("value", itemSnapshot => {
        this.items = [];
        //this.imgs = [];
        itemSnapshot.forEach((itemSnap) => {
            
            storageRef.child(itemSnap.val()).getDownloadURL().then((url) => {
                this.zone.run(() => {
                    const link = url;
                    this.items.push(link);
                })
            })
            return false;
            //this.items.push(itemSnap.val());
        }); 
        console.log(this.items);
    });
    
  }
  
}
