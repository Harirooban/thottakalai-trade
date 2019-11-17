import { Component, OnInit } from '@angular/core';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { HttpService } from 'src/app/http.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-manage-enquiry',
  templateUrl: './manage-enquiry.page.html',
  styleUrls: ['./manage-enquiry.page.scss'],
})
export class ManageEnquiryPage implements OnInit {
  post_details: any;
  enquiry_details: any;

  constructor(private dataTransferService: DataTransferService, private httpService: HttpService, public global: GlobalService) {
    console.log(this.dataTransferService.selected_enquiry_post);
    this.post_details = this.dataTransferService.selected_enquiry_post['post_details'];
    this.enquiry_details = this.dataTransferService.selected_enquiry_post['enquiry_details'];
  }

  markReadClicked(index, enquiry_id) {
    if (confirm('Are you sure to mark this as read')) {
      this.enquiry_details[index]['is_read'] = true;
      let data_dict = {
        'enquiry_id': enquiry_id
      };
      this.httpService.markEnquiryAsRead(data_dict).subscribe(() => {
        this.global.displayToast('Enquiry marked as read', 'middle', 2000);
      }, (error) => {
        console.error(error);
      });
    }
  }

  checkCounts() {
    
  }
  ngOnInit() {
  }

}
