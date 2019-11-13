import { Component, OnInit } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { NavController, PopoverController, Events } from '@ionic/angular';
import { ProductFilterPage } from '../product-filter/product-filter.page';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-buy-list',
  templateUrl: './buy-list.page.html',
  styleUrls: ['./buy-list.page.scss'],
})
export class BuyListPage implements OnInit {
  selected_product: any;
  post_product_list: any;
  is_filter_applied = false;
  filter_data: any;
  filter_keys: any;
  data_before_filter: any;
  applied_filter_dict: any = {};
  today: any;

  constructor(private dataTransfer: DataTransferService, private httpService: HttpService, private navCtrl: NavController,
    private popOverCtrl: PopoverController, private storage: Storage, private events: Events, public global: GlobalService) {
    this.selected_product = this.dataTransfer.selected_product;
    console.log(this.selected_product);
    this.events.subscribe('filter_changed', (data) => {
      this.applyFilterOnProduct();
      console.log('Events subscribe')
    });
  }

  ionViewWillEnter() {
    this.today = new Date().toISOString().split('T')[0];
    console.log(this.today);
    let data_dict = {
      'product_id': this.selected_product['id']
    }
    this.httpService.serveSalePost(data_dict).subscribe((data: any) => {
      console.log(data);
      this.post_product_list = data;
      this.data_before_filter = data;
      if (data.length !== 0) {
        this.applyFilterOnProduct();
      }
    }, (error) => {
      console.error(error);
    });
  }

  applyFilterOnProduct() {
    console.log(this.post_product_list);
    if (this.data_before_filter.length !== 0) {
      this.storage.get('product_filter').then((filter_data) => {
        console.log(filter_data);
        if (filter_data != null) {
          this.filter_data = filter_data;
          this.filter_keys = Object.keys(filter_data);
          this.filter_keys.forEach(element => {
            this.applied_filter_dict[element] = [];
          });
          this.filter_keys.forEach((element) => {
            // District filter
            if (element === 'District') {
              if (this.filter_data[element]['value'].length !== 0) {
                this.applied_filter_dict[element] = this.filter_data[element]['value'];
                this.is_filter_applied = true;
                let value_list = this.filter_data[element]['value'];
                console.log(value_list)
                this.post_product_list = this.data_before_filter.filter((product_element) => {
                  return value_list.indexOf(product_element.district) > -1;
                });
                console.log(this.post_product_list);
                console.log('district filter applied');
              } else {
                this.post_product_list = this.data_before_filter;
              }
            }
            // Sale type
            if (element === 'Sale Type') {
              let selected_size = [];
              this.filter_data[element]['choices'].forEach(choice_index => {
                if (choice_index.checked) {
                  selected_size.push(choice_index.id);
                  this.applied_filter_dict[element].push(choice_index.name);
                }
              });
              if (selected_size.length !== 0) {
                this.is_filter_applied = true;
                this.post_product_list = this.post_product_list.filter((sale_type_element) => {
                  return selected_size.indexOf(sale_type_element.sale_type_id) > -1;
                });
                this.events.publish('sale_type', true);
              }
              else {
                this.post_product_list = this.post_product_list;
                this.events.publish('sale_type', false);

              }
            }
            // Product Type
            if (element === 'Product Type') {
              let selected_size = [];
              this.filter_data[element]['choices'].forEach(choice_index => {
                if (choice_index.checked) {
                  selected_size.push(choice_index.id);
                  this.applied_filter_dict[element].push(choice_index.name);
                }
              });
              if (selected_size.length !== 0) {
                this.is_filter_applied = true;
                this.post_product_list = this.post_product_list.filter((sale_type_element) => {
                  return selected_size.indexOf(sale_type_element.product_type_id) > -1;
                });
                this.events.publish('product_type', true);
              }
              else {
                this.post_product_list = this.post_product_list;
                this.events.publish('product_type', false);
              }
            }
          });
        }
      });
      this.events.unsubscribe('product_filter');
    }
  }
  
  async filterClicked(pop_event: any) {
    const popover = await this.popOverCtrl.create({
      component: ProductFilterPage,
      event: pop_event,
      translucent: true,
      animated: true,
      showBackdrop: true,
      mode: 'ios',
      cssClass: 'product-filter'
    });
    // popover.onDidDismiss().then((data) => {
    //   console.log(data);
    // })
    return await popover.present();
  }
  makeEnquiryClicked(product) {
    this.dataTransfer.enquiryProduct(product);
    this.navCtrl.navigateForward('buy/product/details');
  }

  ngOnInit() {
  }

}
