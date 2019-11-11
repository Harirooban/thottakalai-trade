import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NavController, ModalController } from '@ionic/angular';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { PostRemoveAndSoldOutPage } from '../post-remove-and-sold-out/post-remove-and-sold-out.page';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.page.html',
  styleUrls: ['./manage-post.page.scss'],
})
export class ManagePostPage implements OnInit {
  post_list: any;

  constructor(private httpService: HttpService, private navCtrl: NavController, private dataTransfer: DataTransferService,
    private modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    this.servePostDetails();
  }

  servePostDetails() {
    this.httpService.serveSalePostForSeller().subscribe((data) => {
      console.log(data);
      this.post_list = data;
    }, (error) => {
      console.error(error);
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
    this.navCtrl.navigateForward('sell/product/category')
  }
  ngOnInit() {
  }

}
