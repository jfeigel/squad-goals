import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-goal-delete-dialog',
  templateUrl: './goal-delete-dialog.component.html',
  styleUrls: ['./goal-delete-dialog.component.scss']
})
export class GoalDeleteDialogComponent implements OnInit {
  public goal;

  constructor(
    public dialogRef: MatDialogRef<GoalDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.goal = this.data;
  }
}
