import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public login_form: FormGroup;

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController, private httpService: HttpService,
    private authendicationService: AuthenticationService, private router: Router, private alertController: AlertController,
    private httpClient: HttpClient, private modalCtrl: ModalController, private dataTrasfer: DataTransferService, private storage: Storage) {
    this.login_form = this.formBuilder.group({
      user_name: ['', Validators.compose([Validators.required])],
      password: [null, Validators.required],
    });
  }

  onLoginClicled() {
    // this.login_form.get('user_name').setValue(this.login_form.value.user_name.toLowerCase());
    // const form_user_name = this.login_form.value['user_name']
    // this.nativeStorage.setItem('login_user_name_for_form', form_user_name).then(() => {
    //   console.log('Native Storage');
    // }).catch((error) => {
    //   console.error(error);
    // });
    this.authendicationService.login(this.login_form.value);
    this.login_form.get('password').reset();
    // this.navCtrl.navigateRoot('/app/tabs/(home:home)');
  }

  navPage(user_dict) {
    this.httpService.usernameVerfication(user_dict).subscribe((data) => {
      console.log(data);
      if (data == 'user does not exist') {
        // this.global.displayToast('user does not exist', 'middle',3000);
        alert('incorrect username!');
      } else {
        this.dataTrasfer.userDetailsInPasswordReset(data);
        this.navCtrl.navigateForward('forget-password/' + data['user_id']);
      }
    }, (error) => {
      console.error(error);
      let error_messge = error.error;
      alert(error_messge.message);
    });
  }

  async forgetPassword() {
    const alert_obj = await this.alertController.create({
      header: 'Enter username to reset your password',
      inputs: [{
        name: 'user_name',
        type: 'text',
        value: '',
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (value) => {
            if (value['user_name'] == '') {
              alert('please enter user_name');
              return false;
            }
            console.log(value);
            this.navPage(value);
          }
        }
      ]
    });
    await alert_obj.present();
  }

  async onRegisterClicked() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      componentProps: {},
      cssClass: 'register-modal',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // this.nativeStorage.getItem('login_user_name_for_form').then((username) => {
      //   console.log(username);
      //   if (username != null) {
      //     this.login_form.get('user_name').setValue(username);
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
    });
    modal.present();
  }

  async onGuestModeClicked() {
    console.log('onGuestModeClicked');
    await this.storage.clear().then(() => {
      this.storage.set('user_type', 'guest').then(() => {
        this.authendicationService.authendicationState.next(true);
      });
    });
    // this.events.publish('changed_language', await this.global.getApplanguage());
    // console.log(this.global.getApplanguage());
  }
  ngOnInit() {
  }

}
