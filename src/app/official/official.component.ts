import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { map } from 'rxjs/operators';
import { OfficialService } from './official.service';
import { LoginService } from './../common/services/login.service';
import { Router,} from '@angular/router'; 


@Component({
  selector: 'app-official',
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css']
})
export class OfficialComponent implements OnInit {
  //selectedClass:string;
  selectGameJson:JSON;
  isSelectGameActive:boolean=false;
  headerImg:string;

  constructor(private _router: Router,private http: Http, public officialService: OfficialService, public loginService: LoginService) {
    //this.selectGameJson = this.officialService.getSelectGames();
    
   }

  

  ngOnInit() {
    /*if(!this.loginService.sessionKey){
      this._router.navigate(['login']);
    }*/
    this.isSelectGameActive=true;
    this.headerImg = 'official_header_img';
  }

  // selectGameData(){
  //   if(this.selectGameJson===null){
  //     this.selectGameJson = this.officialService.getSelectGames();      
  //   }  
  // }

  keepSelectActive(){
    if(this.isSelectGameActive==false)
    this.isSelectGameActive=true;
  }

  toggleSelectClass(){
    if(this.isSelectGameActive==true)
    this.isSelectGameActive=!this.isSelectGameActive;
  }
}
