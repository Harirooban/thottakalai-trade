import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-request-in-details',
  templateUrl: './request-in-details.page.html',
  styleUrls: ['./request-in-details.page.scss'],
})
export class RequestInDetailsPage implements OnInit {
  request_details: any;
  page_action = 'via_need_page';
  user_type: any;

  constructor(private dataTransferService: DataTransferService, public global: GlobalService, private router: Router, 
    private storage: Storage, private alertController: AlertController) {
    this.request_details = this.dataTransferService.selected_request_details;
    console.log(this.request_details);
    let url = router.url;
    if (url.includes('home')) {
      this.page_action = 'via_home';
    }
    this.storage.get('user_type').then((user_type) => {
      console.log(user_type);
      this.user_type = user_type;
      if (user_type === 'guest') {
        this.presentAlert();
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'You need to login to see the custome details',
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

  ngOnInit() {
  }

}
