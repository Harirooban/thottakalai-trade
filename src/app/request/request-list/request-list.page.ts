import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {
  request_details: any;

  constructor(private navCtrl: NavController, private httpService: HttpService, private loadingCtrl: LoadingController) {
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

  addNewRequestClicked() {
    this.navCtrl.navigateForward('request/register');
  }

  ngOnInit() {
  }

}
