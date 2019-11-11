import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpService } from 'src/app/http.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.page.html',
  styleUrls: ['./product-filter.page.scss'],
})
export class ProductFilterPage implements OnInit {
  product_filter: any = {};
  filter_options: any;
  selected_index: any[] = [];

  constructor(private storage: Storage, private httpService: HttpService, private events: Events) {
    this.events.subscribe('sale_type', (data) => {
      console.log(data);
      if (data) {
        this.product_filter['Sale Type']['is_clicked'] = true;
      } else {
        this.product_filter['Sale Type']['is_clicked'] = false;
      }
      this.storage.set('product_filter', this.product_filter);
    });
    this.events.subscribe('product_type', (data) => {
      console.log(data);
      if (data) {
        this.product_filter['Product Type']['is_clicked'] = true;
      } else {
        this.product_filter['Product Type']['is_clicked'] = false;
      }
      this.storage.set('product_filter', this.product_filter);
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('product_filter').then((data) => {
      console.log(data);
      if (data !== null) {
        this.product_filter = data;
        this.filter_options = Object.keys(data);
      } else if (data === null) {
        this.generateFilterData();
      }
    });
  }

  onGroupSelected(index) {
    if (this.selected_index.includes(index)) {
      let to_pop_index = this.selected_index.indexOf(index);
      this.selected_index.splice(to_pop_index, 1);
    }
    else {
      this.selected_index.push(index);
    }
    console.log(this.selected_index);
  }

  generateFilterData() {
    this.httpService.serveCvForFilterData().subscribe((data) => {
      console.log(data);
      this.storage.set('district_data', data['district_data']);
      this.storage.set('sale_type_data', data['sale_type_data']);
      this.storage.set('product_type_data', data['product_type_data']);
      this.product_filter['District'] = {
        type: 'dropdown', choices: data['district_data'], value: [], is_clicked: false
      };
      this.product_filter['Sale Type'] = {
        type: 'checkbox', choices: data['sale_type_data'], is_clicked: false
      };
      this.product_filter['Product Type'] = {
        type: 'checkbox', choices: data['product_type_data'], is_clicked: false
      };
      this.storage.set('product_filter', this.product_filter);
      this.filter_options = Object.keys(this.product_filter);
    }, (error) => {
      console.error(error);
    });
  }

  async clearSelectedFilter(filter_option) {
    if (filter_option === 'District') {
      await this.storage.get('district_data').then((district_data) => {
        this.product_filter['District'] = {
          type: 'dropdown', choices: district_data, value: [], is_clicked: false
        };
      });
    }
    if (filter_option === 'Sale Type') {
      await this.storage.get('sale_type_data').then((sale_type_data) => {
        this.product_filter['Sale Type'] = {
          type: 'checkbox', choices: sale_type_data, is_clicked: false
        };
      });
    }
    if (filter_option == 'Product Type') {
      await this.storage.get('product_type_data').then((product_type_data) => {
        this.product_filter['Product Type'] = {
          type: 'checkbox', choices: product_type_data, is_clicked: false
        };
      });
    }

    this.storage.set('product_filter', this.product_filter).then(() => {
      this.events.publish('filter_changed');
    });
  }

  onFilterOptionClicked(filter_option: any, filter_type: any, filter_value?: any) {
    console.log(filter_option);
    console.log(filter_type);
    console.log(filter_value);
    if (filter_option === 'District') {
      if (this.product_filter[filter_option]['value'].length !== 0) {
        this.product_filter[filter_option]['is_clicked'] = true;
      } else {
        this.product_filter[filter_option]['is_clicked'] = false;
      }
    }

    this.storage.remove('product_filter').then(() => {
      this.storage.set('product_filter', this.product_filter).then(() => {
        this.events.publish('filter_changed');
      });
    });
    console.log(this.product_filter[filter_option]);
  }

  async clearClicked() {
    await this.storage.get('district_data').then((district_data) => {
      this.product_filter['District'] = {
        type: 'dropdown', choices: district_data, value: [], is_clicked: false
      };
    });
    await this.storage.get('sale_type_data').then((sale_type_data) => {
      this.product_filter['Sale Type'] = {
        type: 'checkbox', choices: sale_type_data, is_clicked: false
      };
    });
    await this.storage.get('product_type_data').then((product_type_data) => {
      this.product_filter['Product Type'] = {
        type: 'checkbox', choices: product_type_data, is_clicked: false
      };
    });
    this.storage.set('product_filter', this.product_filter).then(() => {
      this.events.publish('filter_changed');
    });
    this.filter_options = Object.keys(this.product_filter);
    this.selected_index = [];
  }
}
