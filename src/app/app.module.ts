import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './common/login/login.component';
import { SelectGameComponent } from './official/select-game/select-game.component';
import { ReportGameComponent } from './official/report-game/report-game.component';
import { PayComponent } from './official/pay/pay.component';
import { ProfileComponent } from './official/profile/profile.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OfficialComponent } from './official/official.component';
import { OfficialService } from './official/official.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material';
import { NgbAccordionModule, NgbAccordionConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { prettier } from 'prettier';
import { CoachComponent } from './coach/coach.component';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './common/header/header.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

import { ModalModule } from 'ngx-bootstrap/modal';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { FybaloaderComponent } from './common/fybaloader/fybaloader.component';
import { LogoutComponent } from './common/logout/logout.component';
import { ModalContentComponent } from './official/official.component';
//import {GrowlModule} from 'primeng/growl';
//import { LightboxModule } from 'ngx-lightbox';
import { ServiceWorkerModule, SwUpdate, SwPush } from '@angular/service-worker';
import { ChangepasswordComponent } from './common/changepassword/changepassword.component';
import { ErrorModalComponent } from './common/error-modal/error-modal.component';
import { NewIncidentComponent } from './official/report-game/new-incident/new-incident.component';
import { ShowIncidentComponent } from './official/report-game/show-incident/show-incident.component';
import { ValidationModalComponent } from './official/report-game/validation-modal/validation-modal.component';
import { StringSplit } from './official/report-game/strsplit.pipe';

import { SuccessPopupComponent } from './official/report-game/success-popup/success-popup.component';
import { ShowNewIncidentComponent } from './official/report-game/show-new-incident/show-new-incident.component';
import { NotifierModule } from 'angular-notifier';
import { SavedataPopupComponent } from './official/report-game/savedata-popup/savedata-popup.component';

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
    ModalContentComponent,
    CoachComponent,
    PlayerComponent,
    HeaderComponent,
    FybaloaderComponent,
    LogoutComponent,
    ChangepasswordComponent,
    ErrorModalComponent,
    NewIncidentComponent,
    ShowIncidentComponent,
    ValidationModalComponent,
    SuccessPopupComponent,
    ShowNewIncidentComponent,
    SavedataPopupComponent,
    StringSplit
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NotifierModule,
    MatSnackBarModule,
    //GrowlModule,
    NgbAccordionModule.forRoot(),
    NgbModalModule.forRoot(),
    ModalModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
    //LightboxModule
  ],
  entryComponents: [
    ModalContentComponent,
    ErrorModalComponent,
    NewIncidentComponent,
    ShowIncidentComponent,
    ValidationModalComponent,
    SuccessPopupComponent,
    ShowNewIncidentComponent,
    SavedataPopupComponent
  ],
  providers: [
    //MessageService,
    HttpClientModule,
    CookieService,
    OfficialService,
    NgbAccordionConfig,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(update: SwUpdate, push: SwPush, snackbar: MatSnackBar) {
    //snackbar.open('hi!');
    console.log(update.available);
    update.available.subscribe((event) => {
      console.log(event);
      //update.activateUpdate().then(() => document.location.reload());
      const snack = snackbar.open('Update Available', 'Reload');
      snack.onAction().subscribe(() => {
        window.location.reload();
      });
    });
  }
}
