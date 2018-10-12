import { NgModule} from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PayComponent } from './official/pay/pay.component';
import { ProfileComponent } from './official/profile/profile.component';
import { SelectGameComponent } from './official/select-game/select-game.component';
import { ReportGameComponent } from './official/report-game/report-game.component';
import { OfficialComponent } from './official/official.component';

const routes: Routes = [
    {path:'', component:SelectGameComponent},
    {path:'LoginComponent', component:LoginComponent},
    {path:'PayComponent', component:PayComponent},
    {path:'ProfileComponent', component:ProfileComponent},
    {path:'SelectGameComponent', component:SelectGameComponent},
    {path:'ReportGameComponent', component:ReportGameComponent},
    {path:'OfficalComponent', component:OfficialComponent}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [LoginComponent,PayComponent,ProfileComponent,SelectGameComponent,ReportGameComponent,OfficialComponent];