import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, NavController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-post-remove-and-sold-out',
  templateUrl: './post-remove-and-sold-out.page.html',
  styleUrls: ['./post-remove-and-sold-out.page.scss'],
})
export class PostRemoveAndSoldOutPage implements OnInit {
  selected_post: any;
  modal_action: any;
  remove_cvs: any[] = [];
  sold_out_answers: any;
  sold_out_questions: string[];
  notes: any = null;
  selected_sold_out_answers: any = {};

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private httpService: HttpService,
    private alertController: AlertController, private navCtrl: NavController, private globalService: GlobalService) {
    this.selected_post = this.navParams.get('post_data');
    this.modal_action = this.navParams.get('action');
    console.log(this.selected_post);
    if (this.modal_action === 'remove') {
      this.httpService.serveSalePostRemoveCv().subscribe((data: any) => {
        console.log(data);
        this.remove_cvs = data;
      }, (error) => {
        console.error(error);
      });
    } else if (this.modal_action === 'sold_out') {
      this.httpService.serveSalePostSoldOutCv().subscribe((data) => {
        console.log(data);
        this.sold_out_answers = data;
        this.sold_out_questions = Object.keys(data);
        this.sold_out_questions.forEach(element => {
          this.selected_sold_out_answers[element] = {};
        });
      }, (error) => {
        console.error(error);
      });
    }
  }

  ngOnInit() {
  }

  removeActionClicked() {
    let checked_ids = this.remove_cvs.reduce((a, element) => element.checked ? a.concat(element.id) : a, []);
    let data_dict = {
      'post_id': this.selected_post['id'],
      // 'checked_ids': checked_ids
    };
    if (checked_ids.length !== 0) {
      data_dict['checked_ids'] = checked_ids
    }
    console.log(this.notes);
    if (this.notes !== null && this.notes !== '') {
      data_dict['notes'] = this.notes;
    }
    console.log(data_dict);
    this.httpService.saveSalePostRemoveDetails(data_dict).subscribe(() => {
      this.modalCtrl.dismiss({
        'data': true
      });
      // this.presentAlert();
    }, (error) => {
      console.error(error);
    });
  }

  soldOutActionClicked() {
    let data = []
    this.sold_out_questions.forEach(element => {
      if (this.selected_sold_out_answers[element] !== {} && this.selected_sold_out_answers[element] !== undefined) {
        data.push(this.selected_sold_out_answers[element]);
      }
    });
    console.log(this.selected_sold_out_answers);
    console.log(data);
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'You removed <strong>' + this.selected_post['product_name'] + '</strong> from your post. <br><br> If you want to add other products?',
      buttons: [
        {
          text: 'Click here',
          handler: () => {
            console.log('add product clicked');
            this.navCtrl.navigateForward('sell/product/category')
          }
        },
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('cancel clicked');
          }
        }
      ]
    });

    await alert.present();
  }

  onDismissClicked() {
    this.modalCtrl.dismiss();
  }
}
