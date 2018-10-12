import { Injectable } from '@angular/core';
import { Http, Response, JSONPConnection} from '@angular/http';
import { map } from 'rxjs/operators';
import { Filter } from './select-game/filter.model';

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
}
