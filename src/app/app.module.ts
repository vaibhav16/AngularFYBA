import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './common/login/login.component';
import { SelectGameComponent } from './official/select-game/select-game.component';
import { ReportGameComponent } from './official/report-game/report-game.component';
import { PayComponent } from './official/pay/pay.component';
import { ProfileComponent } from './official/profile/profile.component';
import { AppRoutingModule, routingComponents} from './app-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OfficialComponent } from './official/official.component';
import { NgbAccordionModule,NgbAccordionConfig,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoachComponent } from './coach/coach.component';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './common/header/header.component';


import { ModalModule } from 'ngx-bootstrap/modal';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { FybaloaderComponent } from './common/fybaloader/fybaloader.component';
import { LogoutComponent } from './common/logout/logout.component';
//import { LightboxModule } from 'ngx-lightbox';
import { ChangepasswordComponent } from './common/changepassword/changepassword.component';
//import { DataSharingService } from './datasharing.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectGameComponent,
    ReportGameComponent,
    PayComponent,
    ProfileComponent,
    routingComponents,
    OfficialComponent,
  
    CoachComponent,
    PlayerComponent,
    HeaderComponent,

    FybaloaderComponent,
    LogoutComponent
    , ChangepasswordComponent
    
  ],
  imports: [
    HttpModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbAccordionModule.forRoot(),
    NgbModalModule.forRoot(),
    ModalModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    //LightboxModule
  ],
  providers: [HttpClientModule,CookieService,
    NgbAccordionConfig, { provide: APP_BASE_HREF, useValue : '/' },
    {provide: LocationStrategy, useClass: HashLocationStrategy} ,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
