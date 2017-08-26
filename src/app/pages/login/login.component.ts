import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ForgetPasswordService } from '../forget-password/forget-apssword.service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  loginForm: FormGroup;
  fpForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  forgotEmail: AbstractControl;
  forgotUsername: AbstractControl;
  submitted: boolean = false;
  isLoginMode: boolean = true;
 isProcessing: boolean = false;

  constructor(
    private userService: UserService,
    fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notification: NotificationsService,
    private fpService: ForgetPasswordService) {

    this.fpForm = fb.group({
      // 'forgotUsername': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'forgotEmail': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
    this.loginForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],

    });


    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
    this.forgotUsername = this.fpForm.controls['forgotUsername'];
    this.forgotEmail = this.fpForm.controls['forgotEmail'];
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
    this.isProcessing = true;
    this.submitted = true;
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        // your code goes here
        const user = `username=${values['email']}&password=${values['password']}&grant_type=password`;

        this.loginService.login(user).subscribe((res) => {
           this.isProcessing = false;
          if (res.IsNewUser !== 'False') {
            this.router.navigate(['resetpassword']);
          } else {
            this.router.navigate(['']);
          }
        }, (error) => {
           this.isProcessing = false;
          this.notification.error('Error', 'Provided username or password is incorrect');
        });
      }
    }
   else{
      const user: any = {};
      user.EmailId = values['forgotEmail'];
      this.fpService.forgetPassword(user).subscribe((res) => {
         this.isProcessing = false;
        this.notification.success('Success', res.Message);
        this.router.navigate(['/login']);
      }, (error) => {
        this.isProcessing = false;
        this.notification.error('Error', 'Failed to reset. Email ID does not exist.');
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


  changeModeHandler(status) {

    this.isLoginMode = !this.isLoginMode;
  }
}
