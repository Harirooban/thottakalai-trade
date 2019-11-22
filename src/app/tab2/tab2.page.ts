import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { DataTransferService } from '../services/data-transfer.service';
import { NavController } from '@ionic/angular';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  enquiry_list: any;
  enquiry_dates: any;
  enquiry_ids: any;

  constructor(private httpService: HttpService, private dataTransfer: DataTransferService, private navCtrl: NavController,
    private global: GlobalService) {
  }

  ionViewWillEnter() {
    this.global.un_read_enquiry_count = 0;
    this.httpService.serveAllEnquiryList().subscribe((data) => {
      console.log(data);
      let enquiry_details = data['enquiry_details']
      this.enquiry_dates = Object.keys(enquiry_details);
      this.enquiry_list = enquiry_details;
      this.enquiry_ids = data['enquiry_ids'];
    }, (error) => {
      console.error(error);
    });
  }

  ionViewWillLeave() {
    console.log('page moved');
    this.markAllEnquiryAsRead();
  }

  enquiryClicked(post_id) {
    this.dataTransfer.selectedNotificationPost(post_id);
    this.navCtrl.navigateForward('manage/enquiry/notification');
    this.markAllEnquiryAsRead();
  }

  markAllEnquiryAsRead() {
    let data_dict = {
      'enquiry_ids': this.enquiry_ids
    };
    this.httpService.markAllEnquiryAsRead(data_dict).subscribe(() => {
    }, (error) => {
      console.error(error);
    });
  }
}
