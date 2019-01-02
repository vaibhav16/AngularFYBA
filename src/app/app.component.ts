import { Component, VERSION, OnInit, ViewChild,ViewEncapsulation  } from '@angular/core';
import { LoginService } from './common/services/login.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSharingService } from './data-sharing.service';
import { CookieService } from 'ngx-cookie-service';
//import { DataSharingService } from './datasharing.service';
//import { isIos } from './../assets/js/index';
//import { isInStandaloneMode } from './../assets/js/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})


export class AppComponent {
  title = 'app';
  closeResult: string; 
  siteOfflineText:string;

  constructor(config: NgbModalConfig, 
    public loginService: LoginService,
    public dataSharingService: DataSharingService,
    public cookieService: CookieService
   ){
    this.dataSharingService.textSize = this.loginService.cookieService.get('textSize');

    config.backdrop = 'static';
    config.keyboard = false;
    //this.textSize = this.loginService.cookieService.get('textSize') ;



  }

  
  ngOnInit(){
    console.log(this.dataSharingService.textSize);
    
    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    //console.log(iOS);
    
  }

   

}