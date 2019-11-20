import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {
  request_details: any;
  product_images: any;

  constructor(private navCtrl: NavController, private httpService: HttpService, private loadingCtrl: LoadingController,
  private dataTransferService: DataTransferService, private storage: Storage) {
    this.storage.get('product_image').then((product_image) => {
      console.log(product_image);
      if (product_image !== null) {
        this.product_images = product_image
      }
    });
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveRequestLog().subscribe((data) => {
      console.log(data);
      this.request_details = data;
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  routePageClicked(page) {
    this.navCtrl.navigateForward(page);
  }

  requestDetailsClicked(request_obj) {
    this.dataTransferService.selectedRequestDetails(request_obj);
    this.navCtrl.navigateForward('request/details');
  }

  ngOnInit() {
  }

}
