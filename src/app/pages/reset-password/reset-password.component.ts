import { Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { UserService } from '../../shared/user.service';
import { UserDetails } from '../../shared/user.interface';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  password: AbstractControl;
  confirmPassword: AbstractControl;
  newPassword: AbstractControl;
  submitted: boolean = false;
  userDetails: UserDetails;
  constructor(fb: FormBuilder,
    private loginService: ResetPasswordService,
    private router: Router,
    private userService: UserService,
    private notification: NotificationsService) {
    const exp = new RegExp(/^(?!OTP).*$/, 'i');
    this.form = fb.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern(exp)])],
      'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern(exp)])],
    });

    this.password = this.form.controls['password'];
    this.newPassword = this.form.controls['newPassword'];
    this.confirmPassword = this.form.controls['confirmPassword'];
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userDetails = response;
    });
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      const _tmpUser = JSON.parse(localStorage.getItem('user_token'));

      // your code goes here
      const user: any = {};
      user.EmailId = _tmpUser.EmailID;
      user.OldPassword = values['password'];
      user.NewPassword = values['newPassword'];
      user.ConfirmPassword = values['confirmPassword'];

      this.loginService.resetPassword(user).subscribe((res) => {
        this.notification.success('Success', 'Password has been updated successfully.');
        this.router.navigate(['/login']);
      }, (error) => {
        this.notification.error('Error', 'Failed to update password.');
      });
    }
  }
}
