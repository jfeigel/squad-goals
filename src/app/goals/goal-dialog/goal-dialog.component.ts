import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit {
  public titleFormControl;
  public amountFormControl;
  public isEditing;
  public goalModel: any = {
    title: null,
    amount: null
  };

  constructor(
    public dialogRef: MatDialogRef<GoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titleFormControl = new FormControl('', [Validators.required]);
    this.amountFormControl = new FormControl('', [Validators.required]);
  }

  ngOnInit() {
    this.goalModel = Object.assign(this.goalModel, this.data);
    this.isEditing = this.data.isEditing;
  }

  public onSubmit(addGoalForm: NgForm) {
    if (!addGoalForm.form.valid) {
      return false;
    }

    this.dialogRef.close(this.goalModel);
  }

}
