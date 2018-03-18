import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDialogComponent } from './goal-dialog.component';

describe('GoalDialogComponent', () => {
  let component: GoalDialogComponent;
  let fixture: ComponentFixture<GoalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
