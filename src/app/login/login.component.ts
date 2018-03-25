import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public usernameFormControl;
  public passwordFormControl;
  public nameFormControl;
  public emailFormControl;
  public passwordConfirmFormControl;
  public userModel = {
    username: null,
    password: null
  };
  public signupModel = {
    name: null,
    email: null,
    password: null,
    passwordConfirm: null
  };
  public errorMessage = null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this.usernameFormControl = new FormControl('', [Validators.required]);
    this.passwordFormControl = new FormControl('', [Validators.required]);
    this.nameFormControl = new FormControl('', [Validators.required]);
    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.passwordConfirmFormControl = new FormControl('', [
      Validators.required
    ]);
  }

  onSubmit() {
    this.errorMessage = null;
    this._authService
      .login(this.userModel)
      .then(results => {
        this._router.navigate([this._authService.redirectUrl]);
      })
      .catch(e => {
        switch (e.status) {
          case 401:
          case 403:
            this.errorMessage = 'Invalid Username and/or Password';
            break;
          default:
            this.errorMessage = `Server Error (${
              e.status
            }). Please try again or contact the administrator.`;
        }
      });
  }
}
