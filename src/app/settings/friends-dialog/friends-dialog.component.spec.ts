import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsDialogComponent } from './friends-dialog.component';

describe('FriendsDialogComponent', () => {
  let component: FriendsDialogComponent;
  let fixture: ComponentFixture<FriendsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
