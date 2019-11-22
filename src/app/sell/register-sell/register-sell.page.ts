import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionSheetController, Platform, LoadingController, AlertController, NavController, ModalController } from '@ionic/angular';
import { CameraProviderService } from 'src/app/services/camera-provider.service';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/global.service';
import { RegisterSellValidators } from './register-sell-validator';
import { Router } from '@angular/router';
import { PreviewRegisterPage } from '../preview-register/preview-register.page';

@Component({
  selector: 'app-register-sell',
  templateUrl: './register-sell.page.html',
  styleUrls: ['./register-sell.page.scss'],
})
export class RegisterSellPage implements OnInit {
  selected_product: any;
  grades: any;
  sale_type: any;
  units: any;
  register_form: FormGroup;
  post_pictures_list: any[] = [];
  product_type: any;
  form_action = 'register';
  sale_type_ids: any;
  product_type_ids: string[];
  unit_ids: string[];
  user_profile: any;
  user_first_name: any;

  constructor(private dataTransfer: DataTransferService, private httpService: HttpService, private formBuilder: FormBuilder, private storage: Storage, private alertController: AlertController,
    private actionsheetCtrl: ActionSheetController, private platform: Platform, private cameraProvider: CameraProviderService, private loadingCtrl: LoadingController,
    public globalService: GlobalService, private router: Router, private ref: ChangeDetectorRef, private navCtrl: NavController, private modalCtrl: ModalController) {
    let today = new Date().toISOString().split('T')[0];
    console.log(today)
    this.register_form = this.formBuilder.group({
      variety: [null, Validators.compose([])],
      sale_type_id: [null, Validators.compose([Validators.required])],
      product_id: [null, Validators.compose([Validators.required])],
      quantity: [null, Validators.compose([Validators.required])],
      unit_id: [null, Validators.compose([Validators.required])],
      grade_id: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([])],
      notes: [null, Validators.compose([])],
      product_type_id: [null, Validators.compose([Validators.required])],
      terms_and_conditions: [null, Validators.compose([RegisterSellValidators.checkTermsAndConditions, Validators.required])],
      availability_date: [today, Validators.compose([Validators.required])],
      expiry_date: [null, Validators.compose([RegisterSellValidators.checkExpiryDate])],
    });
    this.storage.get('user_type').then((user_type) => {
      console.log(user_type);
      if (user_type === 'guest') {
        this.presentAlert();
      }
    });
    this.storage.get('user_first_name').then((user_first_name) => {
      console.log(user_first_name);
      this.user_first_name = user_first_name;
    });
    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.user_profile = user_profile;
    });
    let url = this.router.url;
    if (url.includes('edit')) {
      this.form_action = 'edit';
      this.selected_product = this.dataTransfer.selected_product;
      console.log(this.selected_product);
      this.serveSaleTypeAndUnit(this.selected_product['product_id']);
      this.serveSalePostImages(this.selected_product['id']);
      console.log(url);
    } else {
      this.form_action = 'register';
      this.selected_product = this.dataTransfer.selected_product;
      this.register_form.get('product_id').setValue(this.selected_product['id']);
      this.serveSaleTypeAndUnit(this.selected_product['id']);
    }

  }

  setEditablePostData() {
    let post_data = this.selected_product;
    this.register_form.get('variety').setValue(post_data['variety']);
    this.register_form.get('sale_type_id').setValue(post_data['sale_type_id']);
    this.register_form.get('product_id').setValue(post_data['product_id']);
    this.register_form.get('quantity').setValue(post_data['quantity']);
    this.register_form.get('unit_id').setValue(post_data['unit_id']);
    this.register_form.get('grade_id').setValue(post_data['grade_id']);
    this.register_form.get('price').setValue(post_data['per_unit_price']);
    this.register_form.get('product_type_id').setValue(post_data['product_type_id']);
    this.register_form.get('availability_date').setValue(post_data['availability_date']);
    this.register_form.get('expiry_date').setValue(post_data['expiry_date']);
    console.log(this.register_form.value);
    this.form_action = 'edit';
  }

  serveSalePostImages(post_id) {
    let data_dict = {
      'sale_post_id': post_id
    };
    this.httpService.servePostImages(data_dict).subscribe((data: any) => {
      console.log(data);
      if (data != null) {
        data.forEach(element => {
          this.post_pictures_list.push(element['image']);
        });
      }
    }, (error) => {
      console.error(error);
    });
  }


  async serveSaleTypeAndUnit(product_id) {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    let data_dict = {
      'product_id': product_id
    };
    this.httpService.serveSaleTypeAndUnit(data_dict).subscribe((data) => {
      console.log(data);
      this.grades = data['grade'];
      this.units = data['unit'];
      this.unit_ids = Object.keys(this.units);
      this.product_type = data['product_types'];
      this.product_type_ids = Object.keys(this.product_type);
      this.sale_type = data['sale_type'];
      this.sale_type_ids = Object.keys(this.sale_type);
      if (this.form_action === 'edit') {
        this.setEditablePostData();
        this.ref.detectChanges();
      }
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'You need to login to sell the product',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Back to home',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Home clicked');
            this.globalService.onHomeClicked();
          }
        }, {
          text: 'Login now',
          handler: () => {
            console.log('Login clicked');
            this.globalService.onLoginClicked();
          }
        }
      ]
    });

    await alert.present();
  }

  availabilityDateChanged() {
    this.register_form.get('expiry_date').setValue(null);
  }

  removeExpiryDateClicked() {
    this.register_form.get('expiry_date').setValue(null);
  }

  async registerSell() {
    // let data_dict = {
    //   'form_values': this.register_form.value,
    //   'pictures': this.post_pictures_list
    // };
    console.log(this.register_form.value);
    let temp_dict = {
      'first_name': this.user_first_name,
      'district': this.user_profile['district'],
      'sale_type': this.sale_type[this.register_form.value.sale_type_id]['name'],
      'variety': this.register_form.value.variety,
      'product_type_name': this.product_type[this.register_form.value.product_type_id]['name'],
      'availability_date': this.register_form.value.availability_date,
      'quantity': this.register_form.value.quantity,
      'unit_name': this.units[this.register_form.value.unit_id]['name'],
      'per_unit_price': this.register_form.value.price,
      'product_id': this.selected_product['id']
    };
    if (this.post_pictures_list.length !== 0) {
      temp_dict['image'] = this.post_pictures_list[0];
    } else {
      temp_dict['image'] = null;
    }
    console.log(temp_dict);
    const modal = await this.modalCtrl.create({
      component: PreviewRegisterPage,
      componentProps: {
        'form_values': this.register_form.value,
        'pictures': this.post_pictures_list,
        'temp_dict': temp_dict
      },
      cssClass: 'preview-post',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    modal.present();
    // this.httpService.saveSalePost(data_dict).subscribe((data) => {
    //   console.log(data);
    //   this.globalService.displayToast('Your sale registered', 'middle', 2000);
    //   this.globalService.onHomeClicked();
    // }, (error) => {
    //   console.error(error);
    // });
  }

  async updateSell() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    let data_dict = {
      'form_values': this.register_form.value,
      'pictures': this.post_pictures_list,
      'sale_post_id': this.selected_product['id']
    };
    loading.present();
    console.log(data_dict);
    this.httpService.saveSalePost(data_dict).subscribe((data) => {
      console.log(data);
      this.globalService.displayToast('Your sale updated', 'middle', 2000);
      this.navCtrl.navigateBack('manage/post');
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }

  async choosePicture() {
    const actionsheet = await this.actionsheetCtrl.create({
      header: 'upload picture',
      buttons: [
        {
          text: 'camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();
  }

  async takePicture() {
    const loading = await this.loadingCtrl.create();

    loading.present();

    return this.cameraProvider.getPictureFromCamera().then(
      picture => {
        if (picture) {
          this.post_pictures_list.push(picture);
          // const base64_string = picture.split(',')[1];
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        alert(error);
      }
    );
  }

  async getPicture() {
    const loading = await this.loadingCtrl.create();

    loading.present();

    return this.cameraProvider.getPictureFromPhotoLibrary().then(
      picture => {
        if (picture) {
          this.post_pictures_list.push(picture);
          // this.displatToast('Image Taken!');
        }
        loading.dismiss();
      },
      error => {
        alert(error);
        loading.dismiss();
      }
    );
  }

  removeSelectedPic(index) {
    this.post_pictures_list.splice(index, 1);
  }

  ngOnInit() {
  }

}
