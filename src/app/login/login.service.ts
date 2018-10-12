import { Injectable } from '@angular/core';
import { Login } from './login.model';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  constructor(private http: Http,private router: Router) {
    this.isLoggedIn=false;
    //this.loginFailed=false;
    console.log(this.isLoggedIn);
   } 

postLoginData(userVar : Login){
  //console.log("Inside POST 1.2");
  var jsonData= JSON.stringify(userVar);
  return this.http.post('http://testfaafireworks.1city.us/api/Home',JSON.parse(jsonData))
  .pipe(map((data: Response) => {
  return data.json() as JSON;
  })).toPromise().then(x => {
  this.jsonResult = x; 
  console.log(this.jsonResult);

  if(this.jsonResult["Error"]==200){
    console.log(200);
    //this.router.navigate(['./OfficalComponent']);
    this.isLoggedIn=true;
    this.loginFailed=false;
  }
  else{
    this.isLoggedIn=false;
    this.loginFailed=true;
  }   
  });
}

}

