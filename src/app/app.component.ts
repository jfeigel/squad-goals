import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user;

  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {
    _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.user = _authService.user;
      }
    });
  }

  ngOnInit() {
    this.user = this._authService.user;
  }

  navigate(route) {
    this._router.navigate([route]);
  }

  logout() {
    this._authService.logout();
  }
}
