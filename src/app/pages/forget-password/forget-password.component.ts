import { Router } from '@angular/router';
import { ForgetPasswordService } from './forget-apssword.service';
import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.scss'],
})
export class ForgetPasswordComponent {

  form: FormGroup;
  email: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder,
      private loginService: ForgetPasswordService,
      private router: Router,
      private notification: NotificationsService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.email = this.form.controls['email'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      const user: any = {};
      user.EmailId = values['email'];

      this.loginService.forgetPassword(user).subscribe((res) => {
        console.log('forget-pw-success');
        this.notification.success('Success', res.Message);
        this.router.navigate(['/login']);
      }, (error) => {
        console.log('in-forget-pw-error', error);
        this.notification.error('Error', 'Failed to reset password.');
      });
    }
  }
}
