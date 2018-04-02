import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { AuthService } from '../auth/auth.service';
import { PasswordValidation } from '../shared/password-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @HostBinding('class.page-component') isPage = true;

  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public loginModel = {
    username: null,
    password: null
  };
  public signupModel = {
    name: null,
    email: null,
    password: null,
    passwordConfirm: null
  };
  public loginErrorMessage = null;
  public signupSuccessMessage = null;
  public signupErrorMessage = null;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.loginForm = _fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.signupForm = _fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.loginModel.username = params.email;
    });
  }

  onLogin() {
    this.loginErrorMessage = null;
    this._authService
      .login(this.loginModel)
      .then(results => {
        this._router.navigate([this._authService.redirectUrl]);
      })
      .catch(e => {
        switch (e.status) {
          case 401:
          case 403:
            this.loginErrorMessage = 'Invalid Username and/or Password';
            break;
          default:
            this.loginErrorMessage = `Server Error (${
              e.status
            }). Please try again or contact the administrator.`;
        }
      });
  }

  onSignup() {
    this.signupErrorMessage = null;
    const user = _.cloneDeep(this.signupModel);
    delete user.passwordConfirm;
    this._authService
      .signup(user)
      .then(results => {
        this.signupForm.reset({
          name: null,
          email: null,
          password: null,
          passwordConfirm: null
        });
        this.signupSuccessMessage =
          'Success! Check your email for confirmation.';
      })
      .catch(e => {
        this.signupForm.get('email').setErrors({ taken: true });
        this.signupErrorMessage = e.message;
      });
  }
}
