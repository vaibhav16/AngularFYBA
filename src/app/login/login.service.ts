import { Injectable } from '@angular/core';
import { Login } from './login.model';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OfficialService } from './../official/official.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  requestStatus: boolean = null;
  selectedLogin: Login;
  isLoggedIn: boolean;  
  jsonResult: JSON;
  loginFailed: boolean;
  userId:number=null;
  reportTagLabel: number = null;
  sessionKey:string=null;
  officialSeasonId:string=null;
  seasonId:string=null;
  roleId: string=null;
  leagueId: string = null;

  constructor(private http: Http,private router: Router,
    public cookieService: CookieService) {
    this.isLoggedIn=false;
    //console.log(this.isLoggedIn);
   } 

postLoginData(userVar : Login){
  this.requestStatus=false;
  userVar.Email=userVar.Email.toLowerCase();
  var headerOptions =  new Headers({'Content-Type':'application/json'});
  var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
  return this.http.post('https://fybaservice.sapplesystems.com/api/Home',userVar,requestOptions)
  .pipe(map((data: Response) => {
  return data.json() as JSON;
  })).toPromise().then(x => {
    console.log(x);
  this.jsonResult = x; 
  this.sessionKey=x["SessionKey"];
  this.requestStatus=true;


  if(this.jsonResult["Error"]==200){ 

    this.cookieService.set('SessionKey', this.sessionKey);    
    this.cookieService.set('UserId', this.jsonResult["Value"].UserId); 
    this.cookieService.set('officialSeasonId', this.jsonResult["Value"].OfficialSeasonalId); 
    this.cookieService.set('seasonId', this.jsonResult["Value"].SeasonId); 
    this.cookieService.set('roleId', this.jsonResult["Value"].RoleId);
    this.cookieService.set('leagueId', this.jsonResult["Value"].LeagueId);  
    this.cookieService.set('reportTagLabel', this.jsonResult["Value"].tagsLables.ReportCount);  
   

    this.isLoggedIn=true;
    this.loginFailed=false;
    this.userId=this.jsonResult["Value"].UserId;
    this.router.navigate(['official']);    
    this.officialSeasonId=this.jsonResult["Value"].OfficialSeasonalId;
    //console.log(this.officialSeasonId);
    this.seasonId=this.jsonResult["Value"].SeasonId;
    this.roleId = this.jsonResult["Value"].RoleId;
    this.leagueId = this.jsonResult["Value"].LeagueId;
    this.reportTagLabel = this.jsonResult["Value"].tagsLables.ReportCount;
    
    
    //console.log(this.officialSeasonId);
  }
  else{
    this.isLoggedIn=false;
    this.loginFailed=true;
  }   
  });
}

}

