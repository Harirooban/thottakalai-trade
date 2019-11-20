import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
    private httpService: HttpService,
    private storage: Storage,
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
      this.httpService.serveProductImage().subscribe((data) => {
        console.log(data);
        this.storage.set('product_image', data['product_image']);
        this.storage.set('category_image', data['category_image']);
        this.storage.set('sub_category_image', data['sub_category_image']);
      });
    });
  }
}
