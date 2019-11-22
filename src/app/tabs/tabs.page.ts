import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private httpService: HttpService, public global: GlobalService) {
    this.httpService.serveUnReadEnquiryCount().subscribe((data: any) => {
      console.log(data);
      this.global.un_read_enquiry_count = data;
    }, (error) => {
      console.error(error);
    });
  }

}
