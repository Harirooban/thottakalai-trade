import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../global.service';
import { AuthenticationService } from '../services/authentication.service';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendEnquiryValidator } from '../buy/send-enquiry/send-enquiry-validate';
import { DataTransferService } from '../services/data-transfer.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user_type: any = 'guest';
  user_first_name: any;
  app_version: any = '';
  products: any;
  product_form: FormGroup;

  constructor(private storage: Storage, private global: GlobalService, private authService: AuthenticationService, private loadingCtrl: LoadingController,
    private navCtrl: NavController, private httpService: HttpService, private formBuilder: FormBuilder, private dataTransfer: DataTransferService) {
    this.product_form = this.formBuilder.group({
      product_value: [null, Validators.compose([SendEnquiryValidator.checkProductValue, Validators.required])]
    })
    this.app_version = this.global.app_version;
    this.serveProducts();
  }

  async serveProducts() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveAllProductsDetails().subscribe((data) => {
      console.log(data);
      this.products = data;
      this.storage.set('all_products', data);
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }


  ionViewWillEnter() {
    // this.getAppVersion();
    // this.global.checkGPSPermission();
    this.storage.get('user_type').then((user_type) => {
      console.log(user_type);
      if (user_type !== null) {
        this.user_type = user_type;
        this.storage.get('user_first_name').then((first_name) => {
          console.log(first_name);
          if (first_name != null) {
            this.user_first_name = first_name;
          } else {
            this.user_first_name = 'guest';
          }
        });
      } else {
        this.storage.set('user_type', 'guest');
        this.user_type = 'guest';
        this.user_first_name = 'Guest';
      }
    });

  }

  productSelected(product) {
    this.product_form.get('product_value').setValue(null);
    this.dataTransfer.selectedProduct(product);
    this.navCtrl.navigateForward('buy/list');
  }

  onLogout() {
    if (confirm('Are you sure want to Log Out')) {
      this.authService.logout();
    }
  }

  onLoginClicked() {
    this.global.onLoginClicked();
  }

  routePage(page_name: string) {
    console.log(page_name);
    if (page_name != null) {
      this.navCtrl.navigateForward(page_name);
    }
  }
  // getAppVersion() {
  //   this.httpService.appVersionCheck().subscribe((data) => {
  //     console.log(data);
  //     this.validateApp(data);
  //   }, (error) => {
  //     console.log(error);
  //   })
  // }

  // validateApp(data) {
  //   if (data['version'] != this.global.app_version) {
  //     alert('Please update latest version of your app from play store');
  //     if (data['relogin']) {
  //       this.authService.logout();
  //     }
  //     window.open("https://play.google.com/store/apps/details?id=in.kultivate.tndhpc", "_system");
  //   } else {
  //     console.log('app validate');
  //   }
  // }

  // ionViewDidEnter() {
  //   this.subscription = this.platform.backButton.subscribe(() => {
  //     if (this.router.isActive('/auth/home', true)) {
  //       navigator['app'].exitApp();
  //     }
  //   });
  // }
  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }
}
