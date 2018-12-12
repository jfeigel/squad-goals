import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { SettingsComponent } from '../settings/settings.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<SettingsComponent> {
  canDeactivate(
    component: SettingsComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const user = component.user;
    const tempUser = component.tempUser;

    if (
      user.name !== tempUser.name ||
      user.email !== tempUser.email ||
      tempUser.password ||
      tempUser.passwordConfirm
    ) {
      return window.confirm(
        'Are you sure you want to leave while editing your account?'
      );
    }

    return true;
  }
}
