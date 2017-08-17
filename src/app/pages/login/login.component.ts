import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notification: NotificationsService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    // Just to make sure `auth_token` is clear when, landed on this page
    this.loginService.signOut();
  }
  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      const user = `username=${values['email']}&password=${values['password']}&grant_type=password`;

      this.loginService.login(user).subscribe((res) => {
        console.log('in-subscribe');
        if (res.IsNewUser !== 'False') {
          this.router.navigate(['resetpassword']);
        } else {
          this.router.navigate(['']);
        }
      }, (error) => {
        console.log('login-error', error);
        this.notification.error('Error', 'Failed to login.');
      });
    }
  }
}
