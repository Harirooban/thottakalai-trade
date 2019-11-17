import { Component, OnInit } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  product_sub_category: any;
  page_action: string;
  products: any;
  available_product_count: any;

  constructor(private dataTransfer: DataTransferService, private router: Router, private navCtrl: NavController, private httpService: HttpService,
    public global: GlobalService, private loadingCtrl: LoadingController) {
    this.product_sub_category = this.dataTransfer.selected_product_sub_category;
    console.log(this.product_sub_category);
    let url = this.router.url;
    if (url.includes('sell')) {
      this.page_action = 'sell';
    } else {
      this.page_action = 'buy';
    }
    console.log(this.page_action);
    this.serveProduct();
  }

  async serveProduct() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    let data_dict = {
      'sub_category_id': this.product_sub_category['id']
    };
    this.httpService.serveProduct(data_dict).subscribe((data) => {
      console.log(data);
      this.products = data['product'];
      this.available_product_count = data['count']
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  productClicked(product) {
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
