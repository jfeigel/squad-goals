import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher
} from '@angular/material/core';

import { MatModule } from './material/mat.module';
import { AppRoutingModule } from './app-routing.module';

import 'hammerjs';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GoalsComponent } from './goals/goals.component';
import { SettingsComponent } from './settings/settings.component';
import { ConfirmComponent } from './confirm/confirm.component';

import { GoalDialogComponent } from './goals/goal-dialog/goal-dialog.component';
import { GoalDeleteDialogComponent } from './goals/goal-delete-dialog/goal-delete-dialog.component';
import { FriendsDialogComponent } from './settings/friends-dialog/friends-dialog.component';

import { AuthService } from './auth/auth.service';
import { GoalsService } from './goals/goals.service';
import { UserService } from './user/user.service';
import { ConfirmService } from './confirm/confirm.service';
import { FriendsService } from './friends/friends.service';

import { AuthGuard } from './guards/auth-guard.service';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GoalsComponent,
    ConfirmComponent,
    SettingsComponent,
    GoalDialogComponent,
    GoalDeleteDialogComponent,
    FriendsDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpModule,
    MatModule,
    AppRoutingModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    AuthService,
    GoalsService,
    UserService,
    ConfirmService,
    FriendsService,
    AuthGuard,
    CanDeactivateGuard
  ],
  entryComponents: [
    GoalDialogComponent,
    GoalDeleteDialogComponent,
    FriendsDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
