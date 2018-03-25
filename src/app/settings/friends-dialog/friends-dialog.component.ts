import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-friends-dialog',
  templateUrl: './friends-dialog.component.html',
  styleUrls: ['./friends-dialog.component.scss']
})
export class FriendsDialogComponent implements OnInit {
  public searchField: FormControl;
  public searchForm: FormGroup;
  public results;

  private _user;

  constructor(
    public dialogRef: MatDialogRef<FriendsDialogComponent>,
    private _fb: FormBuilder,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._user = data;
    this.searchField = new FormControl();
    this.searchForm = _fb.group({
      search: this.searchField
    });

    this.searchField.valueChanges
      .debounceTime(400)
      .switchMap(query => this._userService.search(query))
      .subscribe(results => {
        this.results = results;
      });
  }

  ngOnInit() {}

  public addFriend(friend): void {
    this._userService.addFriend(this._user._id, friend._id).then(results => {
      this.dialogRef.close(results);
    });
  }
}
