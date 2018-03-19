import { Component, ViewChild } from '@angular/core';

import { Platform, ModalController, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { SplashPage } from '../pages/splash/splash';
import { BluetoothConnectionPage } from '../pages/bluetooth-connection/bluetooth-connection';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//For Facebook Login
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';

import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = BluetoothConnectionPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,

    //For Facebook Login.
    public nativeStorage: NativeStorage
  ) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      let splash = modalCtrl.create(SplashPage);
      splash.present();
      this.splashScreen.hide();

      const FIREBASE_CONFIG = {
        apiKey: "AIzaSyC-es4FWbYBL0Drcu7xFuR3n6d0SnUH3rA",
        authDomain: "shoe-7855a.firebaseapp.com",
        databaseURL: "https://shoe-7855a.firebaseio.com",
        projectId: "shoe-7855a",
        storageBucket: "shoe-7855a.appspot.com",
        messagingSenderId: "830334382371"
      };

      var app = firebase.initializeApp(FIREBASE_CONFIG);

    });

    {
      platform.ready().then(() => {
        // Here we will check if the user is already logged in
        // because we don't want to ask users to log in each time they open the app
        let env = this;
        this.nativeStorage.getItem('user')
          .then(function (data) {
            // user is previously logged and we have his data
            // we will let him access the app
            env.nav.push(ListPage);
            env.splashScreen.hide();
          }, function (error) {
            //we don't have the user data so we will ask him to log in
            env.nav.push(HelloIonicPage);
            env.splashScreen.hide();
          });

        this.statusBar.styleDefault();
      });

    }

    // set our app's pages
    this.pages = [
      { title: 'Home Page', component: HelloIonicPage },
      { title: 'Playlist', component: ListPage },
      { title: 'Pictures From Camera', component: ItemDetailsPage},
      { title: 'Bluetooth Connection', component: BluetoothConnectionPage },
      { title: 'Login With Facebook', component: LoginPage }
    ];
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
