import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, AlertController, NavController, IonSlides, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpService } from 'src/app/http.service';
import { GlobalService } from 'src/app/global.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('register_slide', { static: false }) register_slides: IonSlides;

  slideOpts = {
    speed: 400,
    allowTouchMove: false
  };

  new_pass_type: any = 'password';
  confirm_pass_type: any = 'password';
  alert: any;

  register_form_basic: FormGroup;
  states: any;
  districts: any = null;
  taluks: any;
  villages: any;
  revenue_villages: any = null;
  blocks: any;
  changed_unit_values: any = [];
  communication_language: any;
  is_otp_visible = false;
  is_trader_exists = false;
  is_phone_editable = false;
  otp_attempt_count: any = 0;
  trade_user_type: any;
  trader_type_cv: any;
  show_company_name = false;

  constructor(private fromBuilder: FormBuilder, private global: GlobalService, private httpService: HttpService,
    private loadingCtrl: LoadingController, private storage: Storage, private alertController: AlertController,
    private modalCtrl: ModalController, private nativeStorage: NativeStorage) {
    this.register_form_basic = this.fromBuilder.group({
      first_name: new FormControl(null, Validators.compose([Validators.required])),
      last_name: new FormControl(null, Validators.compose([Validators.required])),
      state: new FormControl(null, Validators.compose([Validators.required])),
      district: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      confirm_password: new FormControl(null, Validators.compose([Validators.required])),
      phone: new FormControl(null, Validators.compose([Validators.required])),
      // city: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      pincode: new FormControl(null, Validators.compose([Validators.required])),
      company_name: new FormControl(null, Validators.compose([])),
      email: new FormControl(null, Validators.compose([])),
      type_of_trader: new FormControl(null, Validators.compose([Validators.required])),
      trade_user_type: new FormControl(null, Validators.compose([Validators.required])),
      // block: new FormControl(null, Validators.compose([Validators.required])),
      // revenue_village: new FormControl(null, Validators.compose([Validators.required])),
      // pincode: new FormControl(null, Validators.compose([Validators.required])),
      // farm_holding_size_in_hectare: new FormControl(null, Validators.compose([Validators.required])),
      // communication_language: new FormControl(1, Validators.compose([Validators.required])),
      otp: [null]
    });
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveGeneralDataForRegister().subscribe((data) => {
      console.log(data);
      this.districts = data['districts'];
      this.states = data['states'];
      this.trade_user_type = data['trade_user_type'];
      this.trader_type_cv = data['trader_type']
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  userTypeClicked(user_type_id) {
    this.register_form_basic.get('trade_user_type').setValue(user_type_id);
    this.navigateSlideToForward();
  }

  traderTypeChanged() {
    if (this.register_form_basic.value.type_of_trader === 1 || this.register_form_basic.value.type_of_trader === null) {
      this.show_company_name = false;
    } else {
      this.show_company_name = true
    }
  }

  checkNameFormValid() {
    let form_value = this.register_form_basic.value;
    if (form_value.first_name === null || form_value.last_name === null || form_value.email == null || form_value.type_of_trader == null) {
      return true;
    } else {
      return false;
    }
  }

  checkAddressFormValid() {
    let form_value = this.register_form_basic.value;
    if (form_value.district === null || form_value.city === null || form_value.address == null || form_value.pincode == null) {
      return true;
    } else {
      return false;
    }
  }

  checkPasswordFormValid() {
    let form_value = this.register_form_basic.value;
    if (form_value.password === null || form_value.confirm_password === null) {
      return true;
    } else {
      return false;
    }
  }

  navigateToNameForm() {
    let data_dict = {
      'trader_exists': this.is_trader_exists,
      'otp': this.register_form_basic.value.otp,
      'phone': this.register_form_basic.value.phone
    };
    if (this.otp_attempt_count !== 3) {
      this.httpService.otpValidationForTempRegistration(data_dict).subscribe((data) => {
        console.log(data);
        if (this.is_trader_exists) {
          this.presentAlertConfirm(data);
        } else {
          this.navigateSlideToForward();
        }
      }, (error) => {
        console.error(error);
        this.otp_attempt_count += 1;
        let error_messge = error.error;
        this.register_form_basic.get('otp').setValue(null);
        alert(error_messge);
      });
    } else {
      alert('You have crossed 3 attempts');
    }
  }

  async checkTraderExists() {
    const mobile = Math.ceil(Math.log(this.register_form_basic.value['phone'] + 1) / Math.LN10);
    if (mobile > 12) {
      alert('Mobile Number Should not be Greater than 12');
      return false;
    } else if (mobile < 10) {
      alert('Mobile Number Should not be less than 10');
      return false;
    }
    console.log(mobile);
    let data_dict = {
      'phone': this.register_form_basic.value.phone
    };
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    await loading.present();
    this.httpService.checkTraderExists(data_dict).subscribe((data) => {
      console.log(data);
      this.is_trader_exists = data['status'];
      this.is_otp_visible = true;
      this.is_phone_editable = true;
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  navToPasswordSlide() {
    const pincode = Math.ceil(Math.log(this.register_form_basic.value['pincode'] + 1) / Math.LN10);
    if (pincode !== 6) {
      alert("Pincode should be in 6 numbers")
      return false
    }
    this.navigateSlideToForward();
  }

  showNewPassword() {
    if (this.new_pass_type === 'password') {
      this.new_pass_type = 'text';
    } else {
      this.new_pass_type = 'password';
    }
  }

  showConfirmPassword() {
    if (this.confirm_pass_type === 'password') {
      this.confirm_pass_type = 'text';
    } else {
      this.confirm_pass_type = 'password';
    }
  }

  confirmPassword() {
    if (this.register_form_basic.value.confirm_password !== this.register_form_basic.value.password) {
      this.alert = '*passwords does not match';
    } else {
      this.alert = '';
    }
    if (this.register_form_basic.value.confirm_password === '') {
      this.alert = '';
    }
  }


  async presentAlertConfirm(data_dict) {
    const form_user_name = data_dict['user_name'];
    this.nativeStorage.setItem('login_user_name_for_form', form_user_name).then(() => {
      console.log('Native Storage');
    }).catch((error) => {
      console.error(error);
    });
    const alert = await this.alertController.create({
      header: 'You are already an user You can login with following username',
      message: 'username: <strong>' + data_dict['user_name'] + '</strong>',
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.modalCtrl.dismiss();
        }
      }]
    });

    await alert.present();
  }

  navigateSlide(index) {
    this.register_slides.slideTo(index);
  }

  async dismissModal() {
    if (confirm('Are you sure to close?')) {
      this.modalCtrl.dismiss();
    }
  }

  async navigateSlideToForward() {
    const active_index = await this.register_slides.getActiveIndex();
    console.log(active_index);
    this.navigateSlide(active_index + 1);
  }

  async registerClicked() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    console.log(this.register_form_basic.value);
    loading.present();
    const user_name = this.register_form_basic.value.phone;
    this.nativeStorage.setItem('login_user_name_for_form', user_name).then(() => {
      console.log('Native Storage');
    }).catch((error) => {
      console.error(error);
    });
    this.httpService.registerTrader(this.register_form_basic.value).subscribe((data) => {
      console.log(data);
      this.global.displayToast('Registered successfully! you can login to enjoy the feature', 'middle', 2000);
      loading.dismiss();
      this.modalCtrl.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  ngOnInit() {
  }

}
