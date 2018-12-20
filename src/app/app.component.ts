import { Component, VERSION, OnInit, ViewChild,ViewEncapsulation  } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService} from './shared/data.service';
import { LoginService } from './login/login.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { DataSharingService } from './datasharing.service';
//import { isIos } from './../assets/js/index';
//import { isInStandaloneMode } from './../assets/js/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})

//styleUrls: ['./app.component.css']
export class AppComponent {
  title = 'app';
  closeResult: string; 
  siteOfflineText:string;

  constructor(config: NgbModalConfig, public loginService: LoginService
   ){
    //this.textSize = this.loginService.cookieService.get('textSize') ;

    config.backdrop = 'static';
    config.keyboard = false;

  //   this.dataSharingService.textSize.subscribe( value => {
  //     this.textSize = value;
  // });

  }

  textSize:string = null;
  ngOnInit(){
    console.log(this.textSize);
    
    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    console.log(iOS);
    
  }

   

}