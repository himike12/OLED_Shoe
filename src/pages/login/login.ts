﻿import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FB_APP_ID: number = 181705319094673;

  constructor(
    private alertCtrl : AlertController,
    public navCtrl: NavController,
    public fb: Facebook,
    public nativeStorage: NativeStorage
  ) {
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }
  
  test() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  doFbLogin() {
    let permissions = new Array<string>();
    let nav = this.navCtrl;

    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    this.fb.login(permissions)
      .then((response) => {
        let userId = response.authResponse.userID;
        let params = new Array<string>();

        //Getting name and gender properties
        this.fb.api("/me?fields=name,gender", params)
          .then((user) => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //now we have the users info, let's save it in the NativeStorage
            this.nativeStorage.setItem('user',
              {
                name: user.name,
                gender: user.gender,
                picture: user.picture
              })
              .then(() => {
                nav.push(UserPage);
              }, (error) => {
                console.log(error);
              })
          })
      }, (error) => {
        console.log(error);
      });
  }
}