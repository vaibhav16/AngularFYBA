import { Component, VERSION, OnInit, ViewChild,ViewEncapsulation  } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService} from './shared/data.service';
import { LoginService } from './login/login.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(config: NgbModalConfig, private modalService: NgbModal,updates: SwUpdate, private data: DataService, public loginService: LoginService){
     
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit(){
    
    
  }

   

}