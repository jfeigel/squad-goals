import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';



import { environment } from '../../environments/environment';

@Injectable()
export class ConfirmService {
  private _apiUrl = environment.production
    ? '/api/user/confirm'
    : `${environment.host}:${environment.port}/api/user/confirm`;

  constructor(private _http: Http, private _router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const token = route.paramMap.get('token');
    if (!token) {
      return null;
    }
    return this._http
      .post(this._apiUrl, { token: token })
      .toPromise()
      .then(response => response.json())
      .catch(err => {
        const json = err.json();
        json.status = err.status;
        return json;
      });
  }
}
