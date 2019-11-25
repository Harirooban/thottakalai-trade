import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { IonSlides, ModalController, AlertController } from '@ionic/angular';
import { SendEnquiryPage } from '../send-enquiry/send-enquiry.page';
import { GlobalService } from 'src/app/global.service';
import { Storage } from '@ionic/storage';

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
  user_type: any;

  constructor(private dataTransfer: DataTransferService, private httpService: HttpService, private modalCtrl: ModalController, public global: GlobalService,
    private alertController: AlertController,
    private storage: Storage) {
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
    this.storage.get('user_type').then((user_type) => {
      console.log(user_type);
      this.user_type = user_type;
      // if (user_type === 'guest') {
      //   this.presentAlert();
      // }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'You need to login to send enquiry',
      buttons: [
        {
          text: 'Back to home',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Home clicked');
            this.global.onHomeClicked();
          }
        }, {
          text: 'Login now',
          handler: () => {
            console.log('Login clicked');
            this.global.onLoginClicked();
          }
        }
      ]
    });
    await alert.present();
  }

  async sendEnquiryClicked() {
    if (this.user_type === 'guest') {
      this.presentAlert();
    } else {
      const modal = await this.modalCtrl.create({
        component: SendEnquiryPage,
        componentProps: {},
        cssClass: 'send-enquiry',
        backdropDismiss: false
      });
      modal.onDidDismiss().then((data) => {
        console.log(data);
      });
      modal.present();
    }
  }
  ngOnInit() {
  }

}
