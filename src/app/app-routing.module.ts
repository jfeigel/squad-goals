import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GoalsComponent } from './goals/goals.component';
import { SettingsComponent } from './settings/settings.component';
import { ConfirmComponent } from './confirm/confirm.component';

import { AuthGuard } from './guards/auth-guard.service';
import { GoalsService } from './goals/goals.service';
import { UserService } from './user/user.service';
import { ConfirmService } from './confirm/confirm.service';
import { FriendsService } from './friends/friends.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'goals',
    component: GoalsComponent,
    canActivate: [AuthGuard],
    resolve: {
      content: GoalsService,
      user: UserService,
      friends: FriendsService
    }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    resolve: {
      content: UserService,
      friends: FriendsService
    }
  },
  {
    path: 'confirm/:token',
    component: ConfirmComponent,
    canActivate: [AuthGuard],
    resolve: {
      content: ConfirmService
    }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
