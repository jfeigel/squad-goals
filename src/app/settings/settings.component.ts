import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from '@angular/material';

import { FriendsDialogComponent } from './friends-dialog/friends-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public user: any;
  public friends: Array<any>;
  public displayedColumns = ['name', 'email', 'add'];
  public friendsDataSource;

  constructor(public dialog: MatDialog, private _route: ActivatedRoute) {}

  ngOnInit() {
    this._route.data.subscribe((data: { content: any }) => {
      Object.assign(this, data.content);
      this.friendsDataSource = new MatTableDataSource(this.friends);
    });
  }

  public addRow(): void {
    const data = this.friendsDataSource.data;
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
          this.user.friends.push(result._id);
          this.friends = data;
          this.friendsDataSource.data = data;
        }
      });
  }
}
