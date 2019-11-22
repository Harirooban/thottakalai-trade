import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private global: GlobalService, private storage: Storage, private events: Events) {
    console.log('http service');
    console.log(global.server_url);
    this.headers = new HttpHeaders();
    this.storage.get('auth-token').then((token) => {
      if (token != null) {
        console.log('Token avl');
        this.setTokenHeader(token);
      }
    }, (error) => {
      console.error(error);
    });

    this.events.subscribe('login_event', (token) => {
      this.setTokenHeader(token);
    });
  }

  setTokenHeader(token) {
    console.log(token);
    this.headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
    console.log(this.headers);
  }

  login(data) {
    return this.httpClient.post(this.global.server_url + 'instance/login/for/token/', data);
  }

  usernameVerfication(data) {
    return this.httpClient.post(this.global.server_url + 'instance/username/validation/', data);
  }

  resetPassword(data) {
    return this.httpClient.post(this.global.server_url + 'instance/reset/password/', data);
  }

  otpValidation(data) {
    return this.httpClient.post(this.global.server_url + 'instance/otp/validation/', data);
  }

  serveGeneralDataForRegister() {
    return this.httpClient.get(this.global.server_url + 'instance/serve/general/data/for/trade/app/register/');
  }

  checkTraderExists(data) {
    return this.httpClient.post(this.global.server_url + 'instance/check/trader/exists/', data);
  }

  otpValidationForTempRegistration(data) {
    return this.httpClient.post(this.global.server_url + 'instance/otp/validation/for/temporary/registration/trader/app/', data);
  }

  registerTrader(data) {
    return this.httpClient.post(this.global.server_url + 'instance/register/trader/', data);
  }

  serveProductCategory() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/category/');
  }

  serveProductSubCategory(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/sub/categories/', data);
  }

  serveProduct(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/products/', data);
  }

  serveSaleTypeAndUnit(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/sale/types/grade/and/unit/', data);
  }

  saveSalePost(data) {
    return this.httpClient.post(this.global.server_url + 'trade/save/sale/post/', data, { headers: this.headers });
  }

  serveSalePost(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/sale/post/', data, { headers: this.headers });
  }

  servePostImages(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/single/sale/post/images/', data, { headers: this.headers });
  }

  serveSaleType() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/sale/types/', { headers: this.headers });
  }

  saveSalePostEnquiry(data) {
    return this.httpClient.post(this.global.server_url + 'trade/save/sale/post/enquiry/', data, { headers: this.headers });
  }

  serveCvForFilterData() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/cv/for/filter/data/');
  }

  serveAllProductsDetails() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/all/products/details/');
  }

  serveSalePostRemoveCv() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/sale/post/remove/cv/');
  }

  serveSalePostSoldOutCv() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/sale/post/sold/out/cv/');
  }

  serveSalePostForSeller() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/sale/post/for/seller/', { headers: this.headers });
  }

  saveSalePostRemoveDetails(data) {
    return this.httpClient.post(this.global.server_url + 'trade/save/sale/post/remove/details/', data, { headers: this.headers });
  }

  saveSalePostSoldOutDetails(data) {
    return this.httpClient.post(this.global.server_url + 'trade/save/sale/post/sold/out/details/', data, { headers: this.headers });
  }

  updateUserProfile(data) {
    return this.httpClient.post(this.global.server_url + 'trade/update/user/profile/', data, { headers: this.headers });
  }

  serveUserProfileData() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/user/profile/data/', { headers: this.headers });
  }

  markEnquiryAsRead(data) {
    return this.httpClient.post(this.global.server_url + 'trade/mark/enquiry/as/read/', data, { headers: this.headers });
  }

  serveProductCategoryAndSubCategory() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/product/category/sub/category/', { headers: this.headers });
  }

  registerRequestLog(data) {
    return this.httpClient.post(this.global.server_url + 'trade/register/request/log/', data, { headers: this.headers });
  }

  serveRequestLog() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/product/request/log/');
  }

  serveProductImage() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/product/images/');
  }

  serveAllEnquiryList() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/user/product/enquiry_list/', { headers: this.headers });
  }

  serveUnReadEnquiryCount() {
    return this.httpClient.get(this.global.server_url + 'trade/serve/un/read/enquiry/count/', { headers: this.headers });
  }

  serveSelectedPostEnquiry(data) {
    return this.httpClient.post(this.global.server_url + 'trade/serve/selected/post/enquiry/', data, { headers: this.headers });
  }

  markAllEnquiryAsRead(data) {
    return this.httpClient.post(this.global.server_url + 'trade/mark/all/enquiry/as/read/', data, { headers: this.headers });
  }
}
