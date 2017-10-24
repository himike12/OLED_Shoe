import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  tabBarElement: any;
  splash = true;
  images = [ 'Icon1.jpg', 'Icon2.jpg', 'Icon3.png', 'Icon4.png', 'BioWorldLogo.jpg'];
  constructor(public navCtrl: NavController) {
    this.tabBarElement = document.querySelector('.tabbar');
  }
  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 4000);
  }
}
