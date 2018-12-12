import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from '@angular/material';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { FriendsDialogComponent } from './friends-dialog/friends-dialog.component';

import { UserService } from '../user/user.service';
import { PasswordValidation } from '../shared/password-validation';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @HostBinding('class.page-component') isPage = true;

  public userForm: FormGroup;
  public user: any;
  public tempUser: any;
  public isEditingUser;
  public friends: Array<any> = [];
  public pendingFriends: Array<any> = [];
  public displayedColumns = ['name', 'email', 'actions'];
  public pendingDisplayedColumns = ['name', 'email', 'confirm'];
  public friendsDataSource;
  public pendingDataSource;
  public connection: Subscription;

  constructor(
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.userForm = _fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
      },
      { validator: PasswordValidation.MatchPassword }
    );
  }

  ngOnInit() {
    this._route.data.subscribe((data: { content: any; friends: any }) => {
      this.user = data.content;
      this.tempUser = _.cloneDeep(this.user);
      this.friends = data.friends.friends;
      this.pendingFriends = data.friends.pendingFriends;
      this.friendsDataSource = new MatTableDataSource(this.friends);
      this.pendingDataSource = new MatTableDataSource(this.pendingFriends);
    });

    this.connection = this._userService.appObservable.subscribe(res => {
      if (res.type === 'ADD_FRIEND' && this.user._id === res.id) {
        this._friendAdded(res.friend);
      }
      if (res.type === 'CONFIRM_FRIEND' && this.user._id === res.id) {
        this._friendConfirmed(res.friend);
      }
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  public addRow(): void {
    const data = this.pendingDataSource.data;
    const dialogConfig: MatDialogConfig = {
      width: '50vw',
      data: this.user
    };

    this.dialog
      .open(FriendsDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result !== undefined) {
          data.push(result);
          this.user.friends.push({
            id: result._id,
            status: 'Pending',
            confirm: result._id
          });
          this.pendingFriends = data;
          this.pendingDataSource.data = data;
        }
      });
  }

  public viewRow(id): void {
    this._router.navigate(['/goals', { user: id }]);
  }

  public confirmFriend(friend_id): void {
    this._userService.confirmFriend(this.user._id, friend_id).then(friend => {
      this._friendConfirmed(friend);
    });
  }

  public deleteRequest(friend_id): void {
    this._userService.deleteRequest(this.user._id, friend_id).then(friend => {
      this._requestDeleted(friend);
    });
  }

  public editUser(): void {
    this.isEditingUser = true;
  }

  public saveUser(): void {
    this.user = Object.assign(this.user, this.tempUser);
    delete this.user.passwordConfirm;
    this._userService.save(this.user).then(user => {
      const message = this.user.password
        ? 'Password Changed Successfully'
        : 'User Updated Successfully';
      this.user = user;
      this._resetForm();
      this.snackbar.open(message, null, { duration: 5000 });
    });
  }

  public cancelEditUser(): void {
    this._resetForm();
  }

  private _resetForm(): void {
    this.isEditingUser = false;
    this.tempUser = _.cloneDeep(this.user);
    this.userForm.reset({
      name: this.tempUser.name,
      email: this.tempUser.email,
      password: null,
      passwordConfirm: null
    });
  }

  private _friendAdded(friend): void {
    const data = this.pendingDataSource.data;
    data.push(friend);
    this.user.friends.push({
      id: friend._id,
      status: 'Pending',
      confirm: this.user._id
    });
    this.pendingFriends = data;
    this.pendingDataSource.data = data;
  }

  private _friendConfirmed(friend): void {
    const friendsData = this.friendsDataSource.data;
    const pendingData = this.pendingDataSource.data;
    friendsData.push(friend);
    const pendingIndex = _.findIndex(pendingData, { _id: friend._id });
    pendingData.splice(pendingIndex, 1);
    this.friends = friendsData;
    this.pendingFriends = pendingData;
    this.friendsDataSource.data = friendsData;
    this.pendingDataSource.data = pendingData;
  }

  private _requestDeleted(friend): void {
    const pendingData = this.pendingDataSource.data;
    const pendingIndex = _.findIndex(pendingData, { _id: friend._id });
    pendingData.splice(pendingIndex, 1);
    this.pendingDataSource.data = pendingData;
  }
}
