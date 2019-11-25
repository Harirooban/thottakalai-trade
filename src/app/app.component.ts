import { Component } from '@angular/core';

import { Platform, LoadingController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/app/tabs/tab1',
      icon: 'home',
      src: ''
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person',
      src: ''
    },
    {
      title: 'Sell',
      url: 'sell/product/category',
      icon: 'person',
      src: ''
    },
    {
      title: 'Buy',
      url: 'buy/product/category',
      icon: 'heart',
      src: ''
    },
    {
      title: 'Ask your needs',
      url: 'request/register',
      icon: 'heart',
      src: ''
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
    private httpService: HttpService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private fcm: FCM,
    private localNotification: LocalNotifications,
    private global: GlobalService,
    private events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.onNotification().subscribe(data => {
        let data_dict = JSON.stringify(data);
        console.log(data_dict)
        this.global.un_read_enquiry_count = data['un_read_count'];
        this.events.publish('un_read_count_changed');
        if (data.wasTapped) {
          console.log('Received in background');
          // alert(JSON.stringify(data));
        } else {
          console.log('Received in foreground');
          // alert(JSON.stringify(data));
          this.localNotification.schedule(
            {
              title: data['title'],
              text: data['body']
            }
          );
          this.localNotification.cancel(1);
        }
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        alert(token);
      });
      this.authService.authendicationState.subscribe((state) => {
        console.log('auth service in app component state: ' + state);
        this.splashScreen.hide();
        if (state) {
          this.router.navigateByUrl('/app/tabs/tab1');
          // this.httpService.serveUnReadEnquiryCount().subscribe((data: any) => {
          //   console.log(data);
          //   this.global.un_read_enquiry_count = data;
          //   // this.events.publish('un_read_count_changed');
          // }, (error) => {
          //   console.error(error);
          // });
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
