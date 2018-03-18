import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    if (url === '/login') {
      if (this._authService.isLoggedIn) {
        this._router.navigate(['/goals']);
        return false;
      } else {
        return true;
      }
    }

    if (this._authService.isLoggedIn) {
      this._authService.redirectUrl = '/goals';
      return true;
    }

    this._authService.redirectUrl = url;
    this._router.navigate(['/login']);
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}
