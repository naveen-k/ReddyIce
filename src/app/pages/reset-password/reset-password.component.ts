import { Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordComponent {

  form: FormGroup;
  password: AbstractControl;
  confirmPassword: AbstractControl;
  newPassword: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder, private loginService: ResetPasswordService, private router: Router) {
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

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      const user = `password=${values['password']}&newPassword=${values['newPassword']}
      &confirmPassword=${values['confirmPassword']}&grant_type=password`;

      this.loginService.resetPassword(user).subscribe((res) => {
        this.router.navigate(['']);
      });
    }
  }
}
