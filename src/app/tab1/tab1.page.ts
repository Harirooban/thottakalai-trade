import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../global.service';
import { AuthenticationService } from '../services/authentication.service';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
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
  @ViewChild('request_slide', { static: false }) request_slides: IonSlides;
  @ViewChild('recent_post_slide', { static: false }) recent_post_slides: IonSlides;
  slideOpts = {
    speed: 400,
    allowTouchMove: true,
    initialSlide: 1,
    slidesPerView: 4,
    // loop: true,
    // centeredSlides: true,
    autoplay: true
  };
  recentPostOpts = {
    speed: 600,
    allowTouchMove: true,
    initialSlide: 1,
    slidesPerView: 2,
    // loop: true,
    autoplay: true
  };

  user_type: any = 'guest';
  user_first_name: any;
  app_version: any = '';
  products: any;
  product_form: FormGroup;
  requests: any;
  product_images: any = {};
  recent_posts: any;

  constructor(private storage: Storage, private global: GlobalService, private authService: AuthenticationService, private loadingCtrl: LoadingController,
    private navCtrl: NavController, private httpService: HttpService, private formBuilder: FormBuilder, private dataTransfer: DataTransferService) {
    this.product_form = this.formBuilder.group({
      product_value: [null, Validators.compose([SendEnquiryValidator.checkProductValue, Validators.required])]
    })
    this.app_version = this.global.app_version;
    this.serveProducts();
    this.storage.get('product_image').then((product_image) => {
      // console.log(product_image);
      if (product_image !== null) {
        this.product_images = product_image;
      }
    });
  }

  // ionViewDidEnter() {
  //   this.request_slides.startAutoplay();
  //   this.recent_post_slides.startAutoplay();
  // }

  async serveProducts() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveAllProductsDetails().subscribe((data) => {
      console.log(data);
      this.products = data['product'];
      this.storage.set('all_products', data['product']);
      this.requests = data['request'];
      this.recent_posts = data['recent_posts'];
      this.serveProductImages();
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async serveProductImages() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    this.httpService.serveProductImage().subscribe((data) => {
      console.log(data);
      this.product_images = data['product_image']
      this.storage.set('product_image', data['product_image']);
      this.storage.set('category_image', data['category_image']);
      this.storage.set('sub_category_image', data['sub_category_image']);
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  requestDetailsClicked(request_obj) {
    this.dataTransfer.selectedRequestDetails(request_obj);
    this.navCtrl.navigateForward('request/details/via/home');
  }

  makeEnquiryClicked(product) {
    this.dataTransfer.enquiryProduct(product);
    this.navCtrl.navigateForward('buy/product/details');
  }

  ionViewWillEnter() {
    // this.getAppVersion();
    // this.global.checkGPSPermission();
    // this.request_slides.startAutoplay();
    // this.recent_post_slides.startAutoplay();
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
