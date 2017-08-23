import { UserService } from '../../shared/user.service';
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
  forgotEmail: AbstractControl;
  submitted: boolean = false;
  isLoginMode: boolean = true;

  constructor(
    private userService: UserService,
    fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notification: NotificationsService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'forgotEmail': ['', Validators.compose([])],
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.forgotEmail = this.form.controls['forgotEmail'];
  }

  ngOnInit() {
    // Just to make sure `auth_token` is clear when, landed on this page
    this.loginService.signOut();
    const user = this.userService.getUserForAutoLogin();
    if (user) {     
      this.autoLoginUser(user);
    }    
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      const user = `username=${values['email']}&password=${values['password']}&grant_type=password`;

      this.loginService.login(user).subscribe((res) => {
        if (res.IsNewUser !== 'False') {
          this.router.navigate(['resetpassword']);
        } else {
          this.router.navigate(['']);
        }
      }, (error) => {
        this.notification.error('Error', 'Provided username or password is incorrect');
      });
    }
  }

  autoLoginUser(values) {
    const user = `username=${values['email']}&password=${values['password']}&grant_type=password`;
    this.loginService.login(user).subscribe((res) => {
      if (res.IsNewUser !== 'False') {
        this.router.navigate(['resetpassword']);
      } else {
        this.router.navigate(['']);
      }
    }, (error) => {
      // AUTO LOGIN FAILED      
    });
  }

  changeModeHandler() {
    this.isLoginMode = !this.isLoginMode;
  }
}
