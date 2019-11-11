import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform, Events, LoadingController } from '@ionic/angular';
import { GlobalService } from '../global.service';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authendicationState = new BehaviorSubject(true);
  sub_filters: any = {};

  constructor(private global: GlobalService, private httpClient: HttpClient, private storage: Storage, private platoform: Platform,
    private events: Events, private loadingCtrl: LoadingController) {
    this.platoform.ready().then(() => {
      this.checkToken();
    });
  }

  ionViewWillEnter() {
    this.platoform.ready().then(() => {
      this.checkToken();
    });
  }

  async login(data) {

    let loading = await this.loadingCtrl.create({
      animated: true,
      spinner: 'lines',
      message: 'Please wait...'
    });
    loading.present();

    this.httpClient.post(this.global.server_url + 'instance/trade/app/login/for/token/', data).subscribe((res_data) => {
      console.log(res_data);
      this.authendicationState.next(true);
      this.events.publish('login_event', res_data['token']);
      this.platoform.ready().then(() => {
        this.storage.set('user_profile', res_data['user_profile']);
        this.storage.set('user_first_name', res_data['first_name']);
        this.storage.set('user_email', res_data['email']);
        this.storage.set('logged_user_id', res_data['user_id']);
        this.storage.set('user_type', res_data['user_type']);
        loading.dismiss();
        return this.storage.set(TOKEN_KEY, res_data['token']);
      });
    }, (error) => {
      console.log(error);
      loading.dismiss();
      let detailed_error = error.error;
      alert(detailed_error['detail']);
    });
  }

  async logout() {
    return this.storage.clear().then(() => {
      this.authendicationState.next(false);
    });
    // return this.storage.remove(TOKEN_KEY).then(() => {
    //   this.authendicationState.next(false);
    // });
  }

  isAuthenticated() {
    return this.authendicationState.value;
  }

  async checkToken() {
    return this.storage.get(TOKEN_KEY).then((res) => {
      if (res) {
        this.authendicationState.next(true);
      }
    });
  }
}
