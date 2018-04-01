import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Injectable()
export class FriendsService {
  private _apiUrl = environment.production
    ? '/api/friends'
    : `${environment.host}:${environment.port}/api/friends`;

  constructor(private _http: Http, private _router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.getByUser(user._id);
  }

  public get(id): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/${id}`, { withCredentials: true })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  public getByUser(id): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/user/${id}`, { withCredentials: true })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  private _handleError(e: any): Promise<any> {
    console.error('An Error Occurred:', e);
    return Promise.reject(e.message || e);
  }
}
