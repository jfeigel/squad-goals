import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';

import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';

import { GoalsService } from './goals.service';
import { GoalDeleteDialogComponent } from './goal-delete-dialog/goal-delete-dialog.component';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  public complete = 0;
  public total = 0;
  public amountComplete = 0;
  public goalsComplete = 0;
  public currentGoalsComplete = 0;
  public goalsToComplete = 0;
  public amountCompleteColor = 'warn';
  public goalsCompleteColor = 'warn';
  public displayedColumns = [
    'title',
    'amount',
    'done',
    'm',
    't',
    'w',
    'th',
    'f',
    'sa',
    'su',
    'add'
  ];
  public dataSource;
  public day;
  public user;
  public users: Array<any> = [];
  public selectedUser;
  public selectedDate;
  public dates: Array<any> = [];
  public dateRange;

  private _goalsData;
  private _allGoalsData;
  private _daysOfWeek = ['su', 'm', 't', 'w', 'th', 'f', 'sa'];

  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _goalsService: GoalsService
  ) {}

  ngOnInit() {
    setInterval(() => {
      const date = new Date();
      const dayOfWeek = date.getDay();
      this.day = this._daysOfWeek[dayOfWeek];
    }, 1000);
    this._route.params.subscribe(params => {
      this.selectedUser = params.user;
    });
    this._route.data.subscribe(
      (data: { content: any; user: any; friends: any }) => {
        this.user = data.user;
        this.users = _.map(data.friends, friend => {
          return { _id: friend._id, name: friend.name };
        });
        this.users.unshift({
          _id: data.user._id,
          name: data.user.name
        });
        this.selectedUser = this.selectedUser || data.user._id;
        this._allGoalsData = _.cloneDeep(data.content);
        this._allGoalsData = this._allGoalsData.sort((a, b) => {
          return moment(new Date(a.date)).isBefore(new Date(b.date));
        });
        this._goalsData = _.cloneDeep(this._allGoalsData[0]);
        this._setDates();
        this.dataSource = new MatTableDataSource(
          (this._goalsData && this._goalsData.goals) || []
        );
        this._calculate();
      }
    );
  }

  private _calculate() {
    if (this._allGoalsData.length === 0) {
      return false;
    }
    this.complete = _.reduce(
      this._goalsData.goals,
      (complete, goal: any) => {
        const goalTotal =
          Number(goal.m) +
          Number(goal.t) +
          Number(goal.w) +
          Number(goal.th) +
          Number(goal.f) +
          Number(goal.sa) +
          Number(goal.su);
        goal.total = goalTotal;
        return complete + goalTotal;
      },
      0
    );

    this.total = _.reduce(
      this._goalsData.goals,
      (total, goal: any) => {
        return total + goal.amount;
      },
      0
    );

    this.amountComplete = this.complete / this.total * 100;

    if (this.amountComplete < 33) {
      this.amountCompleteColor = 'warn';
    } else if (this.amountComplete >= 33 && this.amountComplete <= 67) {
      this.amountCompleteColor = 'accent';
    } else {
      this.amountCompleteColor = 'primary';
    }

    this.goalsToComplete = Math.floor(this._goalsData.goals.length * 0.75);
    this.currentGoalsComplete = _.reduce(
      this._goalsData.goals,
      (complete, goal: any) => {
        const goalTotal =
          Number(goal.m) +
          Number(goal.t) +
          Number(goal.w) +
          Number(goal.th) +
          Number(goal.f) +
          Number(goal.sa) +
          Number(goal.su);
        return complete + Number(goalTotal >= goal.amount);
      },
      0
    );
    this.goalsComplete = this.currentGoalsComplete / this.goalsToComplete * 100;

    if (this.goalsComplete < 33) {
      this.goalsCompleteColor = 'warn';
    } else if (this.goalsComplete >= 33 && this.goalsComplete <= 67) {
      this.goalsCompleteColor = 'accent';
    } else {
      this.goalsCompleteColor = 'primary';
    }
  }

  private _setDates() {
    this.dates = _.map(this._allGoalsData, week => {
      const rangeStart = moment(new Date(week.date));
      const rangeEnd = moment(new Date(week.date)).add(7, 'd');
      return `${rangeStart.format('MM/DD/YYYY')} - ${rangeEnd.format(
        'MM/DD/YYYY'
      )}`;
    });
    this.selectedDate = this.dates[0];
  }

  public viewChanged(e) {
    this._goalsService.getByUser(e.value).then(goalsData => {
      this._allGoalsData = _.cloneDeep(goalsData);
      this._goalsData = _.cloneDeep(this._allGoalsData[0]);
      this.dataSource.data = (this._goalsData && this._goalsData.goals) || [];
      if (this.user._id !== goalsData._id) {
        const index = this.displayedColumns.indexOf('add');
        if (index !== -1) {
          this.displayedColumns.splice(index, 1);
        }
      } else {
        const index = this.displayedColumns.indexOf('add');
        if (index === -1) {
          this.displayedColumns.push('add');
        }
      }
      this._setDates();
      this._calculate();
    });
  }

  public dateRangeChanged(e) {
    const date = `${e.value.split(' ')[0]} 00:00:00`;
    const goals = _.find(this._allGoalsData, { date: date }).goals;
    this._goalsData.goals = goals;
    this.dataSource.data = goals;
    this._calculate();
  }

  checkboxChanged(e, index, day) {
    if (e.checked) {
      this.complete += 1;
    } else {
      this.complete -= 1;
    }
    this.dataSource.data[index][day] = e.checked;
    this._goalsData.goals = this.dataSource.data;
    this._goalsService.save(this._goalsData);
    this._calculate();
  }

  addRow(goal, index) {
    const data = this.dataSource.data;
    const dialogConfig: MatDialogConfig = {
      width: '50vw',
      data: {}
    };

    if (goal) {
      dialogConfig.data = goal;
    }
    dialogConfig.data.isEditing = !!goal;

    this.dialog
      .open(GoalDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result !== undefined) {
          const isEditing = result.isEditing;
          delete result.isEditing;
          if (!isEditing) {
            data.push({
              title: result.title,
              amount: result.amount,
              m: false,
              t: false,
              w: false,
              th: false,
              f: false,
              sa: false,
              su: false
            });
          } else {
            data[index].title = result.title;
            data[index].amount = result.amount;
          }

          this._goalsData.goals = data;
          this._goalsService.save(this._goalsData);
          this.dataSource.data = data;
          this._calculate();
        }
      });
  }

  removeRow(index) {
    const goal = this.dataSource.data[index];
    const dialogConfig: MatDialogConfig = {
      width: '50vw',
      data: goal
    };

    this.dialog
      .open(GoalDeleteDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this._goalsData.goals.splice(index, 1);
          this._goalsService.save(this._goalsData);
          this.dataSource.data = this._goalsData.goals;
          this._calculate();
        }
      });
  }
}
