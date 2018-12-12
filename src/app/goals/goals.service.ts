import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';



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
    let id;
    if (route.params.user) {
      id = route.params.user;
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      id = user._id;
    }
    return this.getByUser(id).then(
      data => {
        return data;
      },
      err => {
        return null;
      }
    );
  }

  get(user_id?): Promise<any> {
    if (!user_id) {
      const user = this._authService.user;
      user_id = user._id;
    }
    return this._http
      .get(`${this._apiUrl}/${user_id}`, { withCredentials: true })
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

  getByUser(id): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/user/${id}`, { withCredentials: true })
      .toPromise()
      .then(response => response.json())
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
