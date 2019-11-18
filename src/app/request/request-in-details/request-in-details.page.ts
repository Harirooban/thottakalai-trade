import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-request-in-details',
  templateUrl: './request-in-details.page.html',
  styleUrls: ['./request-in-details.page.scss'],
})
export class RequestInDetailsPage implements OnInit {
  request_details: any;

  constructor(private dataTransferService: DataTransferService, public global: GlobalService) {
    this.request_details = this.dataTransferService.selected_request_details;
    console.log(this.request_details);
   }

  ngOnInit() {
  }

}
