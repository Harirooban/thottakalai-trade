import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpService } from 'src/app/http.service';
import { LoadingController, IonSlides } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendEnquiryValidator } from 'src/app/buy/send-enquiry/send-enquiry-validate';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-request-register',
  templateUrl: './request-register.page.html',
  styleUrls: ['./request-register.page.scss'],
})
export class RequestRegisterPage implements OnInit {
  @ViewChild('register_slide', { static: false }) register_slides: IonSlides;
  slideOpts = {
    speed: 400,
    allowTouchMove: false
  };

  all_products: any;
  product_category: any;
  product_sub_category: any;
  products: any;
  product_form: FormGroup;
  selected_product_details = { 'category_id': null, 'sub_category_id': null, 'product': null };
  show_register_form = false;
  request_register_form: FormGroup;
  units: any;
  districts: any;
  states: any;
  user_profile: any;

  constructor(private storage: Storage, private httpService: HttpService, private loadingCtrl: LoadingController, private formBuilder: FormBuilder,
    public global: GlobalService) {
    this.product_form = this.formBuilder.group({
      product_value: [null, Validators.compose([SendEnquiryValidator.checkProductValue, Validators.required])]
    });
    this.request_register_form = this.formBuilder.group({
      product_id: [null, Validators.compose([Validators.required])],
      quantity: [null, Validators.compose([Validators.required])],
      unit_id: [null, Validators.compose([Validators.required])],
      notes: [null, Validators.compose([])],
      state: [null, Validators.compose([Validators.required])],
      district: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([])],
    });

    this.storage.get('all_products').then((products) => {
      console.log(products);
      if (products !== null) {
        this.all_products = products;
      }
    });
    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.user_profile = user_profile;
      this.request_register_form.get('state').setValue(user_profile['state_id']);
      this.request_register_form.get('district').setValue(user_profile['district_id']);
      this.request_register_form.get('address').setValue(user_profile['village']);
    })
    this.httpService.serveGeneralDataForRegister().subscribe((data) => {
      console.log(data);
      this.districts = data['districts'];
      this.states = data['states'];
    }, (error) => {
      console.error(error);
    });
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveProductCategoryAndSubCategory().subscribe((data) => {
      console.log(data);
      this.product_category = data['category'];
      this.product_sub_category = data['sub_category'];
      this.products = data['product'];
      this.units = data['unit'];
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  productSelected(product) {
    console.log(product);
    this.selected_product_details['product'] = product;
    this.request_register_form.get('product_id').setValue(product['id']);
    this.product_form.get('product_value').setValue(null);
    this.register_slides.slideTo(1);
    console.log(this.selected_product_details['product']);

  }

  categoryChanged() {
    this.selected_product_details['sub_category_id'] = null;
    this.selected_product_details['product_id'] = null;
  }

  subCategoryChanged() {
    this.selected_product_details['product_id'] = null;
  }

  backClicked() {
    this.register_slides.slideTo(0);
  }

  stateValueChanged() {
    this.request_register_form.get('district').setValue(null);
  }

  submitClicked() {
    console.log(this.request_register_form.value);
    this.httpService.registerRequestLog(this.request_register_form.value).subscribe(() => {
      this.global.onHomeClicked();
      this.global.displayToast('Your request submitted', 'middle', 2000);
    }, (error) => {
      console.error(error);
    });
  }

  ngOnInit() {
  }

}
