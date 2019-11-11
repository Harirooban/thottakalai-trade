import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpService } from 'src/app/http.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/global.service';
import { SendEnquiryValidator } from './send-enquiry-validate';

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.page.html',
  styleUrls: ['./send-enquiry.page.scss'],
})
export class SendEnquiryPage implements OnInit {
  enquiry_form: FormGroup
  user_first_name: any;
  user_email: any;
  user_profile: any;
  sale_types: any;
  selected_product_details: any = null;
  constructor(private modalCtrl: ModalController, private storage: Storage, private httpService: HttpService, private dataTransfer: DataTransferService,
    private formBuilder: FormBuilder, private globalService: GlobalService) {
    this.enquiry_form = this.formBuilder.group({
      purchase_type_id: [null, Validators.compose([Validators.required])],
      enquiry_note: [null, Validators.compose([SendEnquiryValidator.checkEnquiryNote, Validators.required])],
      terms_and_conditions: [null, Validators.compose([SendEnquiryValidator.checkTermsAndConditions, Validators.required])],
    })
    this.selected_product_details = this.dataTransfer.enquiry_product;
    this.storage.get('user_first_name').then((user_first_name) => {
      console.log(user_first_name);
      this.user_first_name = user_first_name;
    });
    this.storage.get('user_email').then((user_email) => {
      console.log(user_email);
      this.user_email = user_email;
    });
    this.storage.get('user_profile').then((user_profile) => {
      console.log(user_profile);
      this.user_profile = user_profile;
    });
    this.httpService.serveSaleType().subscribe((data) => {
      console.log(data);
      this.sale_types = data;
    }, (error) => {
      console.error(error);
    });
  }

  async dismissModal() {
    this.modalCtrl.dismiss();
  }

  submitClicked() {
    let enquiry_note_temp = this.enquiry_form.value.enquiry_note;
    enquiry_note_temp = enquiry_note_temp.trim();

    if (enquiry_note_temp === '') {
      alert('Enter enquiry note to submit query');
      return false;
    }
    let data_dict = {
      'sale_post_id': this.selected_product_details['id'],
      'purchase_type_id': this.enquiry_form.value.purchase_type_id,
      'enquiry': this.enquiry_form.value.enquiry_note
    };
    console.log(data_dict);
    this.httpService.saveSalePostEnquiry(data_dict).subscribe(() => {
      this.globalService.displayToast('Your enquiry submitted', 'middle', 2000);
      this.modalCtrl.dismiss();
    }, (error) => {
      console.error(error);
    });
  }
  ngOnInit() {
  }

}
