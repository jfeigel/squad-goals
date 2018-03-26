import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public user;
  public badgeCount = 0;
  public connection: Subscription;

  constructor(
    public snackbar: MatSnackBar,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.user = _authService.user;

        if (event.url === '/settings') {
          this.badgeCount = 0;
        }
      }
    });

    this.connection = this._userService.appObservable.subscribe(res => {
      if (res.type === 'ADD_FRIEND') {
        this.snackbar.open('New Friendship Requested', 'Close', {
          duration: 5000
        });
        if (this.user._id === res.id && this._router.url !== '/settings') {
          this.badgeCount++;
        }
      }
      if (res.type === 'CONFIRM_FRIEND') {
        this.snackbar.open('New Friendship Confirmed', 'Close', {
          duration: 5000
        });
      }
    });
  }

  ngOnInit() {
    this.user = this._authService.user;
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  navigate(route) {
    this._router.navigate([route]);
  }

  logout() {
    this._authService.logout();
  }
}
