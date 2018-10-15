import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Filter } from './select-game/filter.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class OfficialService {
 selectGameJson:JSON = null;

  constructor(private http: Http) { 
    
  }

  getSelectGames():any{
    console.log("in getprofile");
    this.http.get("http://testfaafireworks.1city.us/api/officialgames")
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
    
  }

  getSelectGames2():any{
    console.log("in getprofile");
    this.http.get("../../assets/rawJson.json")
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });    
  }

  postFilterData(obj : Filter){
    var body = JSON.stringify(obj);
    console.log(body);
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/officialgames',body,requestOptions).pipe(map(x => {
      console.log(x);
      x.json()}));
  }
}
