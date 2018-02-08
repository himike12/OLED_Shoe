import { IonicImageViewerModule } from 'ionic-img-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { BluetoothSerial} from '@ionic-native/bluetooth-serial';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { BluetoothConnectionPage } from '../pages/bluetooth-connection/bluetooth-connection';
import { ListPage } from '../pages/list/list';
import { SplashPage } from '../pages/splash/splash';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BLE } from '@ionic-native/ble';
import { DetailPage } from '../pages/detail/detail';
import { Pro } from '@ionic/pro';
import { Injectable, Injector } from '@angular/core';

//For Facebook Login
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SplashPage,
    BluetoothConnectionPage,
    DetailPage,
    LoginPage,
    UserPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SplashPage,
    BluetoothConnectionPage,
    DetailPage,
    LoginPage,
    UserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    BluetoothSerial,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    NativeStorage,
    BLE,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }]
  ]
})

const IonicPro = Pro.init('fc0a92be', {
  appVersion: "0.0.1"
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure 
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}
export class AppModule {}
