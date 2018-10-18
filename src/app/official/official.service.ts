import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Filter } from './select-game/filter.model';
import { LoginService} from './../login/login.service';
import { FinalFilter } from './select-game/finalFilter.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable({
  providedIn: 'root'
})
export class OfficialService {
 selectGameJson:JSON = null;
 
 finalFilter: FinalFilter={
  UserID:'',
  SessionKey:'',
  RequestedData:''
 }

  constructor(private http: Http, public loginService: LoginService) {    
  }

  getSelectGames():any{    
    this.http.get("http://testfaafireworks.1city.us/api/officialgames")
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  postSelectGames(obj: Filter):any{
    this.finalFilter.RequestedData=JSON.stringify(obj);
    //console.log("Inside post select games");
    //console.log(this.finalFilter);
    this.finalFilter.SessionKey = this.loginService.sessionKey; //JSON.stringify(sessionKey);
    this.finalFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.finalFilter);   

    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     

      console.log(x);
      this.loginService.sessionKey=x["SessionKey"];
      console.log("session key after post select Games");
      console.log(this.loginService.sessionKey);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }


  postFilterData(obj : Filter){
    console.log("Inside post filter data");
    
    this.finalFilter.RequestedData= JSON.stringify(obj);
    //console.log(this.loginService.sessionKey);
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
    //console.log(this.finalFilter);
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      //console.log("Inside Post");
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }
}
