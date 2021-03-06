import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendEnquiryValidator } from 'src/app/buy/send-enquiry/send-enquiry-validate';

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
  constructor(private navCtrl: NavController, private httpService: HttpService, private router: Router,
    private dataTransfer: DataTransferService, private formBuilder: FormBuilder) {
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
    this.httpService.serveProductCategory().subscribe((data) => {
      console.log(data);
      this.product_category = data;
    }, (error) => {
      console.error(error);
    });

    this.httpService.serveAllProductsDetails().subscribe((data) => {
      console.log(data);
      this.products = data;
    }, (error) => {
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
