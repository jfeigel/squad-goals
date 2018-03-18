import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private _apiUrl = environment.production ? '/api' : `${environment.host}:${environment.port}/api`;
  private _redirectUrl = '/goals';
  private _isLoggedIn: boolean;
  private _user;

  constructor(
    private _http: Http,
    private _router: Router
  ) {
    this._isLoggedIn = localStorage.getItem('user') ? true : false;
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    if (!value) {
      localStorage.removeItem('user');
    }
    this._isLoggedIn = value;
  }

  get user(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  login(user): Promise<any> {
    return this._http
      .post(`${this._apiUrl}/login`, user, { withCredentials: true })
      .toPromise()
      .then(response => {
        response = response.json();
        this._isLoggedIn = true;
        this._user = response;
        localStorage.setItem('user', JSON.stringify(response));
        return response;
      })
      .catch(this.handleError);
  }

  logout(): Promise<any> {
    return this._http
      .post(`${this._apiUrl}/logout`, {}, { withCredentials: true })
      .toPromise()
      .then(response => {
        this._isLoggedIn = false;
        this._user = null;
        localStorage.removeItem('user');
        this._router.navigate(['/']);
        return response.json();
      })
      .catch(this.handleError);
  }

  handleError(e: any) {
    console.error('An Error Occurred:', e);
    return Promise.reject(e);
  }

}
