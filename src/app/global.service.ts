import { Injectable } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _server_url = 'http://localhost:8000/';
  // private _server_url = 'http://192.168.0.2:8000/';
  // private _server_url = 'http://142.93.210.110:80/';

  // bank server urls;
  // private _bank_server_url = 'http://localhost:8001/';
  // private _bank_server_url = 'http://192.168.43.229:8001/';
  private _bank_server_url = 'http://142.93.210.110:83/';

  private _app_version: string = '0.0.1';
  private un_read_count = 0;
  constructor(private toastCtrl: ToastController, private diagnostic: Diagnostic, private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private storage: Storage, private navCtrl: NavController) {
  }

  get server_url() {
    return this._server_url;
  }

  get bank_server_url() {
    return this._bank_server_url;
  }

  get app_version() {
    return this._app_version;
  }

  get un_read_enquiry_count() {
    return this.un_read_count;
  }

  set un_read_enquiry_count(un_read_count) {
    this.un_read_count = un_read_count;
  }

  async displayToast(message: string, position: any, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  // checkNetWorkConnection() {

  // }

  // // Check if application having GPS access permission
  // checkGPSPermission() {
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  //     result => {
  //       if (result.hasPermission) {

  //         // If having permission show 'Turn On GPS' dialogue
  //         this.askToTurnOnGPS();
  //       } else {

  //         // If not having permission ask for permission
  //         this.requestGPSPermission();
  //       }
  //     },
  //     err => {
  //       console.error(err);
  //     }
  //   );
  // }

  // requestGPSPermission() {
  //   this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //     if (canRequest) {
  //     } else {
  //       // Show 'GPS Permission Request' dialogue
  //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
  //         .then(
  //           () => {
  //             // call method to turn on GPS
  //             this.askToTurnOnGPS();
  //           },
  //           error => {
  //             // Show alert if user click on 'No Thanks'
  //             console.log('requestPermission Error requesting location permissions ' + error);
  //           }
  //         );
  //     }
  //   });
  // }

  // askToTurnOnGPS() {
  //   this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //     () => {
  //       // When GPS Turned ON call method to get Accurate location coordinates
  //       // this.getLocationCoordinates()
  //       console.log('GPS Permission Provided');
  //     },
  //     error => {
  //       console.log('Error requesting location permissions ' + JSON.stringify(error));
  //       this.diagnostic.requestLocationAuthorization('GRANTED');
  //     }
  //   );
  // }


  onLoginClicked() {
    this.storage.remove('user_type').then(() => {
      this.navCtrl.navigateBack('login');
    }).catch(() => {
      this.navCtrl.navigateBack('login');
    });
  }

  onHomeClicked() {
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
  async getCurrentPosition() {
    console.log('GeoLocation Called');
    let geo_location: any;
    geo_location = await this.geolocation.getCurrentPosition();
    return geo_location;
  }
}
