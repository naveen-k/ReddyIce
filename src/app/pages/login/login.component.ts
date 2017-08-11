import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: Object): void {    
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      const user = `username=${values['email']}&password=${values['password']}&grant_type=password`;

      this.loginService.login(user).subscribe((res) => {
        localStorage.setItem('auth_token', res.access_token);
        this.router.navigate(['']);
      });
    }
  }
}
