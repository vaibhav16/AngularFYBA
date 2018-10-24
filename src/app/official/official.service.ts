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

 selectedDivisions = [];
 selectedPositions = [];
 selectedLocations = [];
 selectedTimes = [];

  constructor(private http: Http, public loginService: LoginService) {    
  }

  getSelectGames():any{    
    this.http.get("./assets/raw.json")
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {
      console.log(x);
      this.fetchPreselectedFilters(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  postSelectGames(obj: Filter):any{
    this.finalFilter.RequestedData=JSON.stringify(obj);

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
      this.fetchPreselectedFilters(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  fetchPreselectedFilters(x:any){
    this.loginService.sessionKey=x["SessionKey"];
    
    //console.log(x["Value"].SelectedFilters.Division);

    //Fetching all the pre-selected Divisions
  
    let y = x["Value"].SelectedFilters.Division.split(",");
    //console.log(y);

    for(let i=0; i<(y.length); ++i){
      x["Value"].Filters.Filter_Divisions.forEach(element => {   
      
        if(element.id==y[i])
        {
         //console.log(y[i]);
          //console.log(element.id);
          this.selectedDivisions.push(element);

        }  
  });
}
       
    //console.log(this.selectedDivisions);

    y = x["Value"].SelectedFilters.Location.split(",");
    //console.log(y);

    for(let i=0; i<(y.length); ++i){
      x["Value"].Filters.Filter_Locations.forEach(element => {   
      
        if(element.id==y[i])
        {
          //console.log(y[i]);
          //console.log(element.id);
          this.selectedLocations.push(element);

        }  
  });
}

//console.log(this.selectedLocations);

y = x["Value"].SelectedFilters.Position.split(",");
//console.log(y);

for(let i=0; i<(y.length); ++i){
  x["Value"].Filters.Filter_Positions.forEach(element => {   
  
    if(element.id==y[i])
    {
      //console.log(y[i]);
      //console.log(element.id);
      this.selectedPositions.push(element);

    }  
});
}
   
//console.log(this.selectedPositions);

y = x["Value"].SelectedFilters.StartTime.split(",");
//console.log(y);

for(let i=0; i<(y.length); ++i){
  x["Value"].Filters.Filter_StartTimes.forEach(element => {   
  
    if(element.id==y[i])
    {
      //console.log(y[i]);
      //console.log(element.id);
      this.selectedTimes.push(element);

    }  
});
}
   
//console.log(this.selectedTimes);
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
