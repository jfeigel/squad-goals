import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoalsService {
  private _apiUrl = environment.production
    ? '/api/goals'
    : `${environment.host}:${environment.port}/api/goals`;

  constructor(
    private _http: Http,
    private _router: Router,
    private _authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.get().then(
      data => {
        return data;
      },
      err => {
        return null;
      }
    );
  }

  get(): Promise<any> {
    const user = this._authService.user;
    return this._http
      .get(`${this._apiUrl}/${user._id}`, { withCredentials: true })
      .toPromise()
      .then(response => {
        const result = response.json();
        result.id = result._id;
        delete result._id;
        delete result.error;
        return result;
      })
      .catch(this._handleError);
  }

  save(data): Promise<any> {
    return this._http
      .put(`${this._apiUrl}`, data, { withCredentials: true })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  private _handleError(e: any) {
    console.error('An Error Occurred:', e);
    return Promise.reject(e.message || e);
  }
}
