import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import 'rxjs';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
  }
  
  selectedImages = [];
  
  selector(src) {
    alert(src + ' added to playlist');
    this.selectedImages.push(src);
  }
}
