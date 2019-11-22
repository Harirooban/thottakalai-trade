import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Storage } from '@ionic/storage';

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
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.authendicationState.subscribe((state) => {
        console.log('auth service in app component state: ' + state);
        this.splashScreen.hide();
        if (state) {
          this.router.navigateByUrl('/app/tabs/tab1');
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
