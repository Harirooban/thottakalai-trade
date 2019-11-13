import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { SendEnquiryPage } from '../send-enquiry/send-enquiry.page';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-buy-product-details',
  templateUrl: './buy-product-details.page.html',
  styleUrls: ['./buy-product-details.page.scss'],
})
export class BuyProductDetailsPage implements OnInit {
  @ViewChild('common_slide', { static: false }) slides: IonSlides;
  slideImageOpts = {
    effect: 'flip',
    allowTouchMove: true
  };
  selected_product_details: any;
  product_images: any;

  constructor(private dataTransfer: DataTransferService, private httpService: HttpService, private modalCtrl: ModalController, public global: GlobalService) {
    this.selected_product_details = this.dataTransfer.enquiry_product;
    console.log(this.selected_product_details);
    let data_dict = {
      'sale_post_id': this.selected_product_details['id']
    }
    this.httpService.servePostImages(data_dict).subscribe((data) => {
      console.log(data);
      this.product_images = data;
    }, (error) => {
      console.error(error);
    });
  }

  async sendEnquiryClicked() {
    const modal = await this.modalCtrl.create({
      component: SendEnquiryPage,
      componentProps: {},
      cssClass: 'register-modal',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    modal.present();
  }
  ngOnInit() {
  }

}
