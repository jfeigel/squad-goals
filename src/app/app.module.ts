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

import { GoalDialogComponent } from './goals/goal-dialog/goal-dialog.component';
import { GoalDeleteDialogComponent } from './goals/goal-delete-dialog/goal-delete-dialog.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './guards/auth-guard.service';
import { GoalsService } from './goals/goals.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GoalsComponent,
    GoalDialogComponent,
    SettingsComponent,
    GoalDeleteDialogComponent
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
    AuthGuard,
    GoalsService
  ],
  entryComponents: [GoalDialogComponent, GoalDeleteDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
