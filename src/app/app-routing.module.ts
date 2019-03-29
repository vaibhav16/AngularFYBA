import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { PayComponent } from './official/pay/pay.component';
import { ProfileComponent } from './official/profile/profile.component';
import { SelectGameComponent } from './official/select-game/select-game.component';
import { ReportGameComponent } from './official/report-game/report-game.component';
import { OfficialComponent } from './official/official.component';
import { CoachComponent } from './coach/coach.component';
import { PlayerComponent } from './player/player.component';
import { AuthGuard } from './auth.guard';
import { DeactivateGuard } from './deactivate-guard';
//import { PreventLoggedInAccess } from './preventLogin.guard';
import { PlayerDataComponent } from '././player/player-data/player-data.component';
import { FybaloaderComponent } from './common/fybaloader/fybaloader.component';
import { LogoutComponent } from './common/logout/logout.component';
import { ChangepasswordComponent } from './common/changepassword/changepassword.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'official',
    component: OfficialComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'SelectGameComponent', pathMatch: 'full' },
      {
        path: 'SelectGameComponent',
        component: SelectGameComponent
      },
      { path: 'PayComponent', component: PayComponent },
      { path: 'ProfileComponent', component: ProfileComponent },
      {
        path: 'ReportGameComponent',
        component: ReportGameComponent,
        canDeactivate: [DeactivateGuard],
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'coach', component: CoachComponent, canActivate: [AuthGuard] },
  {
    path: 'player',
    component: PlayerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'playerdata',
        component: PlayerDataComponent
      }
    ]
  },
  { path: 'fybaloader', component: FybaloaderComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  {
    path: 'changepassword',
    component: ChangepasswordComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
  LoginComponent,
  PayComponent,
  ProfileComponent,
  SelectGameComponent,
  ReportGameComponent,
  OfficialComponent,
  CoachComponent,
  PlayerComponent
];
