import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-preview-register',
  templateUrl: './preview-register.page.html',
  styleUrls: ['./preview-register.page.scss'],
})
export class PreviewRegisterPage implements OnInit {
  forms_values: any;
  pictures: any;
  temp_values_for_display: any;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private httpService: HttpService,
    private globalService: GlobalService, private loadingCtrl: LoadingController) {
    this.forms_values = this.navParams.get('form_values');
    this.pictures = this.navParams.get('pictures');
    this.temp_values_for_display = this.navParams.get('temp_dict');
    console.log(this.temp_values_for_display);
  }

  async dismissModal() {
    this.modalCtrl.dismiss();
  }

  async confirmClicked() {
    const loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines-small',
    });
    loading.present();
    let data_dict = {
      'form_values': this.forms_values,
      'pictures': this.pictures
    };
    console.log(data_dict);
    this.httpService.saveSalePost(data_dict).subscribe((data) => {
      console.log(data);
      this.modalCtrl.dismiss();
      this.globalService.displayToast('Your sale registered', 'middle', 2000);
      this.globalService.onHomeClicked();
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
      console.error(error);
    });
  }
  ngOnInit() {
  }

}
