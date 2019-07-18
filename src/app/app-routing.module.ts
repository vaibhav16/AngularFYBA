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
//import { PlayerDataComponent } from '././player/player-data/player-data.component';
import { FybaloaderComponent } from './common/fybaloader/fybaloader.component';
import { LogoutComponent } from './common/logout/logout.component';
import { ChangepasswordComponent } from './common/changepassword/changepassword.component';
import { PlayerProfileComponent } from './player/player-profile/player-profile.component';
import { TeamComponent } from './player/team/team.component';
import { ComposeEmailComponent } from './player/team/compose-email/compose-email.component';
import { CoachProfileComponent } from './coach/coach-profile/coach-profile.component';
import { StandingsComponent } from './player/standings/standings.component';
import { PlayerCalendarComponent } from './player/player-calendar/player-calendar.component';
import { CoachCalendarComponent } from './coach/coach-calendar/coach-calendar.component';
import { PlayerteamComponent } from './player/playerteam/playerteam.component';
import { ReportResultsComponent } from './coach/report-results/report-results.component';
import { CoachteamComponent } from './coach/coachteam/coachteam.component';
import { BlastemailComponent } from './coach/blastemail/blastemail.component';

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
  {
    path: 'coach', component: CoachComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'calendar', 
        component: CoachCalendarComponent
      },
      {
        path: 'teaminfo', 
        component: CoachteamComponent
      },
      {
        path: 'reportresults', 
        component: ReportResultsComponent
      },
      {
        path: 'profile', 
        component: CoachProfileComponent
      },
      {
        path: 'blastemail', 
        component: BlastemailComponent
      }
    ]
  },
  {
    path: 'player',
    component: PlayerComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    children: [
      {
        path: 'calendar', 
        component: PlayerCalendarComponent
      },
      {
        path: 'team',
        component: TeamComponent,
        canDeactivate: [DeactivateGuard],
        // children: [{
        //   path: 'compose-email',
        //   component: ComposeEmailComponent
        // }]
      },
      {
        path: 'teaminfo',
        component: PlayerteamComponent,
        canDeactivate: [DeactivateGuard],
        // children: [{
        //   path: 'compose-email',
        //   component: ComposeEmailComponent
        // }]
      },
      {
        path: 'standings',
        component: StandingsComponent,
        canDeactivate: [DeactivateGuard]        
      },
      {
        path: 'profile',
        component: PlayerProfileComponent,
        canDeactivate: [DeactivateGuard]
      },
      {
        path: 'compose-email', 
        component: ComposeEmailComponent
      },
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
export class AppRoutingModule { }

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