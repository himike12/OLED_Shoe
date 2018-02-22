import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
//import 'rxjs';
import { storage, initializeApp } from 'firebase';
import { FIREBASE_CONFIG } from "../../app/firebase.config";
import { Camera, CameraOptions } from "@ionic-native/camera";
import 'rxjs';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  
  constructor(private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController) {
    //initializeApp(FIREBASE_CONFIG);
  }

  takePhoto() {
    //Defining Camera options
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      //Correct one
      //const result = await this.camera.getPicture(options);
      const result = this.camera.getPicture(options);

      const image = 'data:image/jpeg;base64,${result}';

      const pictures = storage().ref('pictures');
      pictures.putString(image, 'data_url');
    }
    catch (e) {
      console.error(e);
    }
  }
  
  selectedImages = [];
  
  selector(src) {
    this.selectedImages.push(src);
  }
}
