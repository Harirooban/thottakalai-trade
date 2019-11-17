import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { PostRemoveAndSoldOutPage } from '../post-remove-and-sold-out/post-remove-and-sold-out.page';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.page.html',
  styleUrls: ['./manage-post.page.scss'],
})
export class ManagePostPage implements OnInit {
  post_list: any;
  enquiry_details: any;
  readed_enquiry_details: any;

  constructor(private httpService: HttpService, private navCtrl: NavController, private dataTransfer: DataTransferService,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
    this.servePostDetails();
  }

  async servePostDetails() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    this.httpService.serveSalePostForSeller().subscribe((data) => {
      console.log(data);
      this.post_list = data['post_data'];
      this.enquiry_details = data['enquiry_data'];
      this.readed_enquiry_details = data['readed_data'];
      loading.dismiss();
    }, (error) => {
      console.error(error);
      loading.dismiss();
    });
  }
  postEditClicked(post) {
    this.dataTransfer.selectedProduct(post);
    this.navCtrl.navigateForward('sell/edit');
  }

  async removeOrSoldOutClicked(post, action) {
    const modal = await this.modalCtrl.create({
      component: PostRemoveAndSoldOutPage,
      componentProps: {
        'post_data': post,
        'action': action
      },
      cssClass: 'post-action',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data']) {
        this.servePostDetails();
      }
    });
    modal.present();
  }

  addNewProductClicked() {
    this.navCtrl.navigateForward('sell/product/category');
  }

  enquiryProductClicked(post) {
    let data_dict = {
      'post_details': post,
      'enquiry_details': this.enquiry_details[post.id]
    };
    this.dataTransfer.selectedEnquiryPost(data_dict);
    this.navCtrl.navigateForward('manage/enquiry');
  }

  ngOnInit() {
  }

}
