import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @HostBinding('class.page-component') isPage = true;

  public errorMessage;
  public hasError;
  public user;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this._route.data.subscribe((data: { content: any }) => {
      if (data.content && data.content.error) {
        this.errorMessage = data.content.message;
        this.hasError = true;
      } else {
        this.user = data.content;
        this.hasError = false;
      }
    });
  }

  ngOnInit() {}

  public goToLogin(): void {
    this._router.navigate(['/login', { email: this.user.email }]);
  }
}
