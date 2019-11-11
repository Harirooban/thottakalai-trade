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
  changed_unit_values: any[];
  communication_language: any;
  districts: any;
  revenue_villages: any;
  is_form_editable = true;
  blocks: any;
  caste_list: any;
  farmer_data: any = null;

  constructor(private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private httpService: HttpService,
    private global: GlobalService, private storage: Storage, private navCtrl: NavController) {
    this.user_profile_form = this.formBuilder.group({
      first_name: [null, Validators.compose([Validators.required])],
      last_name: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required, Validators.min(100000)])],
      state: [23, Validators.compose([Validators.required])],
      district: [null, Validators.compose([Validators.required])],
      block: [null, Validators.compose([Validators.required])],
      revenue_village: [null, Validators.compose([Validators.required])],
      // village: [null],
      street: [null, Validators.compose([])],
      email: [null, Validators.compose([])],
      phone: [null, Validators.compose([Validators.required])],
      alternate_phone: [null],
      communication_language: [null, Validators.compose([])],
      caste: [null, Validators.compose([])],
      farm_holding_size_in_hectare: [null, Validators.compose([Validators.required])],
      aadhaar_number: [null, Validators.compose([])],
      family_card_number: [null, Validators.compose([Validators.min(1)])],
      voter_card_epic_number: [null, Validators.compose([Validators.min(1)])],
      pan_number: [null, Validators.compose([])],
      password: [null],
      latitude: [null, Validators.compose([])],
      longitude: [null, Validators.compose([])],
      timestamp: [null, Validators.compose([])],
      // farm_holding_size_classification: [null, Validators.required],
      selected_unit: ['ha'],
    });
  }

  async ionViewWillEnter() {
    // const loading = await this.loadingCtrl.create({
    //   animated: true,
    //   spinner: 'lines-small',
    // });
    // loading.present();
    // this.serveFarmerData();
    // this.httpService.serveGeneralDataForRegister().subscribe((data) => {
    //   console.log(data);
    //   this.communication_language = data['comminication_language'];
    //   this.caste_list = data['caste_list'];
    //   let state_district_taluk = data['state_district_details'];
    //   this.districts = state_district_taluk['districts'];
    //   this.revenue_villages = state_district_taluk['revenue_village'];
    //   this.blocks = state_district_taluk['block'];
    //   loading.dismiss();
    // }, (error) => {
    //   loading.dismiss();
    //   console.error(error);
    // });
  }

  serveFarmerData() {
    // this.httpService.serveSingleFarmerData().subscribe((data) => {
    //   console.log(data);
    //   this.farmer_data = data;
    //   this.user_profile_form.get('first_name').setValue(data['first_name']);
    //   this.user_profile_form.get('last_name').setValue(data['last_name']);
    //   this.user_profile_form.get('phone').setValue(data['phone']);
    //   this.user_profile_form.get('pincode').setValue(data['pincode']);
    //   this.user_profile_form.get('district').setValue(data['district']);
    //   this.user_profile_form.get('block').setValue(data['block']);
    //   this.user_profile_form.get('revenue_village').setValue(data['revenue_village']);
    //   this.user_profile_form.get('street').setValue(data['street']);
    //   this.user_profile_form.get('farm_holding_size_in_hectare').setValue(data['farm_holding_size_in_hectare']);
    //   this.user_profile_form.get('aadhaar_number').setValue(data['aadhaar_number']);
    //   this.user_profile_form.get('pan_number').setValue(data['pan_number']);
    //   this.user_profile_form.get('family_card_number').setValue(data['family_card_number']);
    //   this.user_profile_form.get('voter_card_epic_number').setValue(data['voter_card_epic_number']);
    //   this.user_profile_form.get('email').setValue(data['email']);
    //   this.user_profile_form.get('caste').setValue(data['caste']);
    //   this.user_profile_form.get('communication_language').setValue(data['communication_language']);
    //   this.storage.set('farmer_data', this.farmer_data);
    // }, (error) => {
    //   console.error(error);
    // });
  }

  districtValueChanged() {
    this.user_profile_form.get('block').setValue(null);
  }

  blockValueChanged() {
    this.user_profile_form.get('revenue_village').setValue(null);
  }

  unitValueChanged() {
    this.changed_unit_values = [];
    this.FarmerAreaVauleChanged();
  }

  FarmerAreaVauleChanged() {
    this.changed_unit_values = [];
    if (this.user_profile_form.value.selected_unit === 'ha') {
      let changed_acre = this.user_profile_form.value.farm_holding_size_in_hectare * 2.4711;
      let changed_cent = this.user_profile_form.value.farm_holding_size_in_hectare * 249.56521739;
      this.changed_unit_values.push(
        { 'name': 'in acre', 'value': changed_acre },
        { 'name': 'in cent', 'value': changed_cent }
      );
    }
    if (this.user_profile_form.value.selected_unit === 'ac') {
      let changed_ha = this.user_profile_form.value.farm_holding_size_in_hectare / 2.4711;
      let changed_cent = this.user_profile_form.value.farm_holding_size_in_hectare * 100;
      this.changed_unit_values.push(
        { 'name': 'in ha', 'value': changed_ha },
        { 'name': 'in cent', 'value': changed_cent }
      );
    }
    if (this.user_profile_form.value.selected_unit === 'cent') {
      let changed_acre = this.user_profile_form.value.farm_holding_size_in_hectare / 100;
      let changed_ha = this.user_profile_form.value.farm_holding_size_in_hectare / 249.56521739;
      this.changed_unit_values.push(
        { 'name': 'in acre', 'value': changed_acre },
        { 'name': 'in ha', 'value': changed_ha }
      );
    }
  }

  formEditClicked() {
    this.is_form_editable = !this.is_form_editable;
    if (!this.is_form_editable) {
      this.user_profile_form.get('first_name').setValue(this.farmer_data['first_name']);
      this.user_profile_form.get('last_name').setValue(this.farmer_data['last_name']);
      this.user_profile_form.get('phone').setValue(this.farmer_data['phone']);
      this.user_profile_form.get('pincode').setValue(this.farmer_data['pincode']);
      this.user_profile_form.get('district').setValue(this.farmer_data['district']);
      this.user_profile_form.get('block').setValue(this.farmer_data['block']);
      this.user_profile_form.get('revenue_village').setValue(this.farmer_data['revenue_village']);
      this.user_profile_form.get('street').setValue(this.farmer_data['street']);
      this.user_profile_form.get('farm_holding_size_in_hectare').setValue(this.farmer_data['farm_holding_size_in_hectare']);
      this.user_profile_form.get('aadhaar_number').setValue(this.farmer_data['aadhaar_number']);
      this.user_profile_form.get('pan_number').setValue(this.farmer_data['pan_number']);
      this.user_profile_form.get('family_card_number').setValue(this.farmer_data['family_card_number']);
      this.user_profile_form.get('voter_card_epic_number').setValue(this.farmer_data['voter_card_epic_number']);
      this.user_profile_form.get('email').setValue(this.farmer_data['email']);
      this.user_profile_form.get('caste').setValue(this.farmer_data['caste']);
      this.user_profile_form.get('communication_language').setValue(this.farmer_data['communication_language']);
    }
  }

  updateFarmer() {
    if (this.user_profile_form.value.selected_unit === 'ac') {
      let area_in_ha = this.user_profile_form.value.farm_holding_size_in_hectare / 2.4711;
      this.user_profile_form.get('farm_holding_size_in_hectare').setValue(area_in_ha);
    }

    if (this.user_profile_form.value.selected_unit === 'cent') {
      let area_in_ha = this.user_profile_form.value.farm_holding_size_in_hectare / 249.56521739;
      this.user_profile_form.get('farm_holding_size_in_hectare').setValue(area_in_ha);
    }
    console.log(this.user_profile_form.value);
    // this.httpService.updateFarmerProfile(this.user_profile_form.value).subscribe(() => {
    //   this.serveFarmerData();
    //   this.is_form_editable = true;
    //   this.global.displayToast('Profile Updated', 'middle', 2000);
    // }, (error) => {
    //   console.error(error);
    // });
  }

  bankDetailsClicked() {
    this.navCtrl.navigateForward('bank/list');
  }

  managePostClicked() {
    this.navCtrl.navigateForward('manage/post');
  }
  ngOnInit() {
  }

}
