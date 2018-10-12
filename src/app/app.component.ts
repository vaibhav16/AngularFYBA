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

  //update: boolean = false;
  //joke: any; 
  siteOfflineText:string;

  constructor(config: NgbModalConfig, private modalService: NgbModal,updates: SwUpdate, private data: DataService, public loginService: LoginService){
    //this.loginService.isLoggedIn=false;
   
    //updates.available.subscribe(event => {
      //this.update = true;
    //})
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit(){
    //this.data.gimmeJokes().subscribe(res => {
      //this.joke = res;
    //})   
    
  }

  open(content) {
    console.log("hello");
    this.modalService.open(content);
  }

}
