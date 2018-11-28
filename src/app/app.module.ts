import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { DataService} from './shared/data.service';
import { LoginComponent } from './login/login.component';
import { SelectGameComponent } from './official/select-game/select-game.component';
import { ReportGameComponent } from './official/report-game/report-game.component';
import { PayComponent } from './official/pay/pay.component';
import { ProfileComponent } from './official/profile/profile.component';
import { AppRoutingModule, routingComponents} from './app-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OfficialComponent } from './official/official.component';
import { NgbAccordionModule,NgbAccordionConfig,NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './others/modal/modal.component';
import { CookieComponent } from './others/cookie/cookie.component';
import { CookieService } from 'ngx-cookie-service';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from './others/dropdown/dropdown.component';
import { MultiselectComponent } from './others/multiselect/multiselect.component';
import { CoachComponent } from './coach/coach.component';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './common/header/header.component';
import { Pipe, PipeTransform } from "@angular/core";
import { ArraySortPipe } from './shared/sort.pipe';
import { ImguploadComponent } from './others/imgupload/imgupload.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './auth.guard';

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
    ModalComponent,
    CookieComponent,
    DropdownComponent,
    MultiselectComponent,
    CoachComponent,
    PlayerComponent,
    HeaderComponent,
    ArraySortPipe,
    ImguploadComponent
   
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
    
  ],
  providers: [HttpClientModule,CookieService,
    NgbAccordionConfig, { provide: APP_BASE_HREF, useValue : '/' },
    {provide: LocationStrategy, useClass: HashLocationStrategy} ,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
