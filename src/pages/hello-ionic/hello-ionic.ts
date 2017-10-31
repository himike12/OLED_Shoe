import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  constructor(public navCtrl: NavController, private splashScreen: SplashScreen) {
    this.splashScreen.show();
    window.setTimeout(function () {
      this.splashscreen.hide();
  }, 3000);
  }
}
