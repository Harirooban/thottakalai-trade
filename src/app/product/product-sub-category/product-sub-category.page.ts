import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.page.html',
  styleUrls: ['./product-sub-category.page.scss'],
})
export class ProductSubCategoryPage implements OnInit {
  page_action: any;
  product_category: any;
  product_sub_category: Object;
  available_product_sub_category: any;

  constructor(private router: Router, private dataTransfer: DataTransferService, private httpService: HttpService, private navCtrl: NavController) {
    this.product_category = this.dataTransfer.selected_product_category;
    console.log(this.product_category);
    let url = this.router.url;
    if (url.includes('sell')) {
      this.page_action = 'sell';
    } else {
      this.page_action = 'buy';
    }
    console.log(this.page_action);
    let data_dict = {
      'category_id': this.product_category['id']
    };
    this.httpService.serveProductSubCategory(data_dict).subscribe((data) => {
      console.log(data);
      this.product_sub_category = data['sub_category'];
      this.available_product_sub_category = data['count'];
    }, (error) => {
      console.error(error);
    });
  }

  productSubCategoryClicked(product) {
    this.dataTransfer.selectedProductSubCategory(product);
    if (this.page_action === 'sell') {
      this.navCtrl.navigateForward('sell/product');
    } else if (this.page_action === 'buy') {
      this.navCtrl.navigateForward('buy/product');
    }
  }
  ngOnInit() {
  }

}
