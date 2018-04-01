import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { FriendsDialogComponent } from './friends-dialog/friends-dialog.component';

import { UserService } from '../user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  public user: any;
  public friends: Array<any> = [];
  public pendingFriends: Array<any> = [];
  public displayedColumns = ['name', 'email', 'actions'];
  public pendingDisplayedColumns = ['name', 'email', 'confirm'];
  public friendsDataSource;
  public pendingDataSource;
  public connection: Subscription;

  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this._route.data.subscribe((data: { content: any; friends: any }) => {
      this.user = data.content;
      this.friends = data.friends;
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

  public confirmFriend(friend_id): void {
    this._userService.confirmFriend(this.user._id, friend_id).then(friend => {
      this._friendConfirmed(friend);
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
}
