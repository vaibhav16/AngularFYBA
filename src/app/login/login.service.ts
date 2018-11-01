import { Injectable } from '@angular/core';
import { Login } from './login.model';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OfficialService } from './../official/official.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class LoginService {

  selectedLogin: Login;
  isLoggedIn: boolean;  
  jsonResult: JSON;
  loginFailed: boolean;
  userId:number=null;
  sessionKey:string=null;
  officialSeasonId:string=null;
  seasonId:string=null;

  constructor(private http: Http,private router: Router) {
    this.isLoggedIn=false;
    //this.loginFailed=false;
    console.log(this.isLoggedIn);
   } 

postLoginData(userVar : Login){
  //console.log("Inside POST 1.2");
  //var jsonData= JSON.stringify(userVar);
 
  //var body = JSON.parse(userVar); 
  //console.log(body);
  //sconsole.log(userVar);
  var headerOptions =  new Headers({'Content-Type':'application/json'});
  var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
  return this.http.post('http://testfaafireworks.1city.us/api/Home',userVar,requestOptions)
  .pipe(map((data: Response) => {
  return data.json() as JSON;
  })).toPromise().then(x => {
    console.log(x);
  this.jsonResult = x; 
  this.sessionKey=x["SessionKey"];


  if(this.jsonResult["Error"]==200){    
   
    this.isLoggedIn=true;
    this.loginFailed=false;

    this.userId=this.jsonResult["Value"].UserId;
    //console.log(this.jsonResult);
    this.officialSeasonId=this.jsonResult["Value"].OfficialSeasonalId;
    this.seasonId=this.jsonResult["Value"].SeasonId;
    console.log(this.officialSeasonId);
    //console.log(this.userId);
  }
  else{
    this.isLoggedIn=false;
    this.loginFailed=true;
  }   
  });
}

}

