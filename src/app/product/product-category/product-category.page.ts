import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendEnquiryValidator } from 'src/app/buy/send-enquiry/send-enquiry-validate';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage implements OnInit {
  page_action: any;
  product_category: any;
  product_value: string;
  isProductAvailable = false;
  products: any;
  product_form: FormGroup
  category_images: any = {};
  available_product_category: any;

  constructor(private navCtrl: NavController, private httpService: HttpService, private router: Router, private storage: Storage,
    private dataTransfer: DataTransferService, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, public global: GlobalService, ) {
    this.product_form = this.formBuilder.group({
      product_value: [null, Validators.compose([SendEnquiryValidator.checkProductValue, Validators.required])]
    })
    let url = this.router.url;
    if (url.includes('sell')) {
      this.page_action = 'sell';
    } else {
      this.page_action = 'buy';
    }
    console.log(this.page_action);
    this.storage.get('all_products').then((products) => {
      console.log(products);
      if (products !== null) {
        this.products = products;
      }
    });
    this.storage.get('category_image').then((category_image) => {
      console.log(category_image);
      if (category_image !== null) {
        this.category_images = category_image
      }
    });
    // this.httpService.serveAllProductsDetails().subscribe((data) => {
    //   console.log(data);
    //   this.products = data;
    // }, (error) => {
    //   console.error(error);
    // });
    this.serveProductCategory();
  }

  async serveProductCategory() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveProductCategory().subscribe((data) => {
      console.log(data);
      this.product_category = data['category'];
      this.available_product_category = data['count'];
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }
  productCategoryClicked(product) {
    this.product_form.get('product_value').setValue(null);
    this.dataTransfer.selectedProductCategory(product);
    if (this.page_action === 'sell') {
      this.navCtrl.navigateForward('sell/product/sub/category');
    } else if (this.page_action === 'buy') {
      this.navCtrl.navigateForward('buy/product/sub/category');
    }
  }

  productSelected(product) {
    this.product_form.get('product_value').setValue(null);
    this.dataTransfer.selectedProduct(product);
    if (this.page_action === 'sell') {
      this.navCtrl.navigateForward('sell/register');
    } else if (this.page_action === 'buy') {
      this.navCtrl.navigateForward('buy/list');
    }
  }

  ngOnInit() {
  }

}
