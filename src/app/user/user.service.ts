import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';



import { Observable ,  Observer ,  Subject } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  public appObservable: Observable<any>;
  private _appObserver: Observer<any>;
  private _socket;
  private _hostUrl = `${environment.host}:${environment.port}`;
  private _apiUrl = environment.production
    ? '/api/user'
    : `${this._hostUrl}/api/user`;

  constructor(private _http: Http, private _router: Router) {
    this._socket = io(this._hostUrl);

    this.appObservable = new Observable(observer => {
      this._appObserver = observer;
      this._socket.on('friend', data => observer.next(data));
      return () => {
        this._socket.disconnect();
      };
    });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.get(user._id);
  }

  public get(id): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/id/${id}`, { withCredentials: true })
      .toPromise()
      .then(response => {
        const res = response.json();
        delete res.error;
        return res;
      })
      .catch(this._handleError);
  }

  public getByEmail(email): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/email/${email}`, { withCredentials: true })
      .toPromise()
      .then(response => {
        const res = response.json();
        delete res.error;
        return res;
      })
      .catch(this._handleError);
  }

  public save(user): Promise<any> {
    return this._http
      .put(this._apiUrl, user, { withCredentials: true })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  public getFriends(id): Promise<any> {
    return this._http
      .get(`${this._apiUrl}/${id}/friends`, { withCredentials: true })
      .toPromise()
      .then(response => {
        const res = response.json();
        delete res.user.error;
        return res;
      })
      .catch(this._handleError);
  }

  public addFriend(user_id, friend_id): Promise<any> {
    return this._http
      .post(`${this._apiUrl}/${user_id}/friends`, {
        friend_id: friend_id
      })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  public confirmFriend(user_id, friend_id): Promise<any> {
    return this._http
      .put(`${this._apiUrl}/${user_id}/friends`, {
        friend_id: friend_id
      })
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  public deleteRequest(user_id, friend_id): Promise<any> {
    return this._http
      .delete(`${this._apiUrl}/${user_id}/friends/${friend_id}`)
      .toPromise()
      .then(response => response.json())
      .catch(this._handleError);
  }

  public search(query): Observable<any> {
    return this._http
      .get(`${this._apiUrl}/search?query=${encodeURIComponent(query)}`)
      .map(response => response.json());
  }

  private _handleError(e: any): Promise<any> {
    console.error('An Error Occurred:', e);
    return Promise.reject(e.message || e);
  }
}
