import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { GlobalService } from '../global.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user_profile_form: FormGroup;
  districts: any;
  revenue_villages: any;
  is_form_editable = true;
  blocks: any;
  caste_list: any;
  user_data: any = null;
  states: any;
  trade_user_type: any;
  trader_type_cv: any;

  constructor(private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private httpService: HttpService,
    public global: GlobalService, private storage: Storage, private navCtrl: NavController) {
    this.user_profile_form = this.formBuilder.group({
      first_name: [null, Validators.compose([Validators.required])],
      last_name: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required, Validators.min(100000)])],
      state: [null, Validators.compose([Validators.required])],
      district: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      type_of_trader: [null, Validators.compose([Validators.required])],
      trade_user_type: [null, Validators.compose([Validators.required])],
      company_name: [null, Validators.compose([])],
      alternate_phone: [null, Validators.compose([])],
    });
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.serveUserData();
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

  serveUserData() {
    this.httpService.serveUserProfileData().subscribe((data) => {
      console.log(data);
      this.user_data = data;
      this.user_profile_form.get('first_name').setValue(data['first_name']);
      this.user_profile_form.get('last_name').setValue(data['last_name']);
      this.user_profile_form.get('phone').setValue(data['phone']);
      this.user_profile_form.get('pincode').setValue(data['pincode']);
      this.user_profile_form.get('district').setValue(data['district']);
      this.user_profile_form.get('state').setValue(data['state']);
      this.user_profile_form.get('email').setValue(data['email']);
      this.user_profile_form.get('address').setValue(data['address']);
      this.user_profile_form.get('trade_user_type').setValue(data['trade_user_type']);
      this.user_profile_form.get('type_of_trader').setValue(data['type_of_trader']);
      this.user_profile_form.get('company_name').setValue(data['company_name']);
      this.user_profile_form.get('alternate_phone').setValue(data['alternate_phone']);
      // this.storage.set('farmer_data', this.farmer_data);
    }, (error) => {
      console.error(error);
    });
  }


  updateFarmer() {
    console.log(this.user_profile_form.value);
    this.httpService.updateUserProfile(this.user_profile_form.value).subscribe(() => {
      // this.serveUserData();
      this.is_form_editable = true;
      this.global.displayToast('Profile Updated', 'middle', 2000);
    }, (error) => {
      console.error(error);
    });
  }

  managePostClicked() {
    this.navCtrl.navigateForward('manage/post');
  }

  formEditClicked() {
    this.is_form_editable = !this.is_form_editable
  }
  stateValueChanged() {
    this.user_profile_form.get('district').setValue(null);
  }
  ngOnInit() {
  }

}
