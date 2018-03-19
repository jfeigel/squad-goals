import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from '@angular/material';

import * as _ from 'lodash';

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

  private _goalsData;

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
      switch (dayOfWeek) {
        case 0:
          this.day = 'su';
          break;
        case 1:
          this.day = 'm';
          break;
        case 2:
          this.day = 't';
          break;
        case 3:
          this.day = 'w';
          break;
        case 4:
          this.day = 'th';
          break;
        case 5:
          this.day = 'f';
          break;
        case 6:
          this.day = 'sa';
          break;
      }
    }, 1000);
    this._route.data.subscribe((data: { content: any }) => {
      this._goalsData = data.content;
      this.dataSource = new MatTableDataSource(this._goalsData.goals);
      this._calculate();
    });
  }

  private _calculate() {
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
