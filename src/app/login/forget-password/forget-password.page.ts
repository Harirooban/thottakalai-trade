import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GlobalService } from '../../global.service';
import { HttpService } from 'src/app/http.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  otp_session = true;
  password_reset_session = false;
  new_pass_type: any = 'password';
  confirm_pass_type: any = 'password';
  confirm_pass: any;
  new_pass: any;
  alert: any;
  otp: any;
  user_id: any;
  user_details: any;
  otp_attempt_count: any = 0;

  constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute, private navCtrl: NavController,
    private dataTransfer: DataTransferService, private global: GlobalService) {
    this.user_id = this.activatedRoute.snapshot.paramMap.get('user_id');
    this.user_details = this.dataTransfer.user_details;
    this.user_details['mobile'] = String(this.user_details['mobile']);
    console.log(this.user_details);
  }

  navToPasswordReset() {
    let data_dict = {
      'otp': this.otp,
      'user_id': this.user_id
    };
    if (this.otp_attempt_count !== 3) {
      this.httpService.otpValidation(data_dict).subscribe((data) => {
        console.log(data);
        this.otp_session = false;
        this.password_reset_session = true;
      }, (error) => {
        console.log(error);
        this.otp_attempt_count += 1;
        let error_messge = error.error;
        this.otp = null;
        alert(error_messge.message);
      });
    } else {
      alert('You have crossed 3 attempts');
      this.navCtrl.pop();
    }
  }

  confirmPassword() {
    console.log(this.confirm_pass);
    if (this.confirm_pass !== this.new_pass) {
      this.alert = '*passwords does not match';
    } else {
      this.alert = '';
    }
    if (this.confirm_pass === '') {
      this.alert = '';
    }
  }

  showNewPassword() {
    if (this.new_pass_type === 'password') {
      this.new_pass_type = 'text';
    } else {
      this.new_pass_type = 'password';
    }
  }

  showConfirmPassword() {
    if (this.confirm_pass_type === 'password') {
      this.confirm_pass_type = 'text';
    } else {
      this.confirm_pass_type = 'password';
    }
  }

  savePassword() {
    if (this.new_pass === this.confirm_pass) {
      let data_dict = {
        'user_id': this.user_id,
        'raw_password': this.new_pass,
      };
      this.httpService.resetPassword(data_dict).subscribe((data) => {
        this.navCtrl.pop();
        this.global.displayToast('Your password has been changed successfully!, Now you can login', 'middle', 2000);
      });
    }

  }

  ngOnInit() {
  }

}
