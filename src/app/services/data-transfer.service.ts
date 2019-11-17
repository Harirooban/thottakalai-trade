import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  user_details: any;
  bank_details: any;
  selected_product_category: any;
  selected_product_sub_category: any;
  selected_product: any;
  enquiry_product: any;
  selected_post_id: any;
  selected_enquiry_post: any;

  constructor() { }

  userDetailsInPasswordReset(user_obj) {
    this.user_details = user_obj;
  }

  selectedFarmerBankDetails(bank_obj) {
    this.bank_details = bank_obj;
  }

  selectedProductCategory(product) {
    this.selected_product_category = product;
  }

  selectedProductSubCategory(product) {
    this.selected_product_sub_category = product;
  }

  selectedProduct(product) {
    this.selected_product = product;
  }

  enquiryProduct(product) {
    this.enquiry_product = product;
  }

  selectedPostId(edit_post_id) {
    this.selected_post_id = edit_post_id;
  }

  selectedEnquiryPost(obj) {
    this.selected_enquiry_post = obj;
  }
}
