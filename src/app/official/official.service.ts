import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Filter } from './select-game/filter.model';
import { LoginService} from './../login/login.service';
import { FinalFilter } from './select-game/finalFilter.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { SignUpRequestedData } from './../models/signUp_rd.model';
import { IntialFilter } from './../models/initialFilter.model';
import { ReportGameData } from '../models/official/reportgame/reportGame.model';
import { APIGamePost } from '../models/official/reportgame/APIGamePost.model';
import { APIPlayerScorePost } from '../models/official/reportgame/APIPlayerScorePost.model';


@Injectable({
  providedIn: 'root'
})

export class OfficialService {
 selectGameJson:JSON = null;
 reportGameJson:JSON = null;
 requestStatus: number = 0;
 requestSuccess:boolean = false;
 requestFailure:boolean = false;
 numberOfSelectGameClicks:number = 0;
 initialData:Filter;
 initialFilter: IntialFilter = {
   UserID:'',
   SessionKey:''
 }

 signUpRD: SignUpRequestedData = {
     GameIds: '',
     GroupId: '',
     PositionID: '',
     OfficialSeasonId:'',
     ForCancelSignUp:''
 }

 reportGameData: ReportGameData = {
   SeasonId:'',
   OfficialSeasonId:''
 }
 
 finalFilter: FinalFilter={
  UserID:'',
  SessionKey:'',
  RequestedData:''
 }

 APIGamePost:  APIGamePost ={
  Roleid:'',
  SeasonId:'',
  OfficialSeasonId:'',
  OfficiatingPositionId:'',
  GameId : '',
  GameName:'',
  GameDate:'',
  Location:'',
  GameStartTime:'',
  HomeTeam:'',
  VisitingTeam:'',
  HomeTeamId : '',
  VisitingTeamId:'',   
  HomeTeamScore : '',
  VisitingTeamScore : '',
  Division:'',
  LeagueId:'',
  HomeTeamPlayerScores : [{
    GameId: '',
    PlayerName:'',
    PlayerSeasonalId: '',
    FoulId: '',
    Points: null,
    PlayerNote: null,
    NotPresent:null,
    Rebound:'',
    TeamId:'',
    TeamName:''
  }],
  VisitingTeamPlayerScores : [{
    GameId: '',
    PlayerName:'',
    PlayerSeasonalId: '',
    FoulId: '',
    Points: null,
    PlayerNote: null,
    NotPresent:null,
    Rebound:'',
    TeamId:'',
    TeamName:''  
  }],
  ScoreSheetImages:[{
    ImageURL:'',
    NewImageByteCode:''}]
 }

 APIPlayerScorePost : APIPlayerScorePost ={
  GameId : '',
  PlayerName : '',
  PlayerSeasonalId : '',
  FoulId : '',
  Points : null,
  PlayerNote : null,
  NotPresent:null,
  TeamId : '',
  TeamName:'',
  Rebound:''
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
    this.numberOfSelectGameClicks++;
    //this.finalFilter.RequestedData=JSON.stringify(obj);
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
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

  
  refershSelectGameData(obj: Filter):any{  
    //this.finalFilter.RequestedData=JSON.stringify(obj);
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  fetchPreselectedFilters(x:any){
    this.loginService.sessionKey=x["SessionKey"];

    //Fetching all the pre-selected Divisions
  
    let y = x["Value"].SelectedFilters.Division.split(",");

    for(let i=0; i<(y.length); ++i){
      x["Value"].Filters.Filter_Divisions.forEach(element => {   
      
        if(element.id==y[i])
        {
          let existItem = this.selectedDivisions.filter(item => item.itemName === element.itemName);
          if (existItem.length < 1) { 
          this.selectedDivisions.push(element);
          }
        }  
  });
}

    y = x["Value"].SelectedFilters.Location.split(",");

    

    for(let i=0; i<(y.length); ++i){
      x["Value"].Filters.Filter_Locations.forEach(element => {   
      
        if(element.id==y[i])
        {          
          let existItem = this.selectedLocations.filter(item => item.itemName === element.itemName);
          if (existItem.length < 1) {
                       
          this.selectedLocations.push(element);
          }
        }  
  });
}

y = x["Value"].SelectedFilters.Position.split(",");

for(let i=0; i<(y.length); ++i){
  x["Value"].Filters.Filter_Positions.forEach(element => {   
  
    if(element.id==y[i])
    {
      let existItem = this.selectedPositions.filter(item => item.itemName === element.itemName);
      if (existItem.length < 1) {
        this.selectedPositions.push(element);
      }
    }  
});
}

y = x["Value"].SelectedFilters.StartTime.split(",");

for(let i=0; i<(y.length); ++i){
  x["Value"].Filters.Filter_StartTimes.forEach(element => {   
  
    if(element.id==y[i])
    {
      let existItem = this.selectedTimes.filter(item => item.itemName === element.itemName);
      if (existItem.length < 1) { 
        this.selectedTimes.push(element);
      }
    }  
});
}
  }

  postFilterData(obj : Filter){
    console.log("Inside post filter data");
    
    this.finalFilter.RequestedData= JSON.stringify(obj);    
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  postSignUp(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
    this.signUpRD.GroupId=groupId;
    this.signUpRD.GameIds=gameId;
    this.signUpRD.PositionID=positionId;
    this.signUpRD.OfficialSeasonId=this.loginService.officialSeasonId;
    this.signUpRD.ForCancelSignUp=ForCancelSignUp;

    this.finalFilter.UserID=this.loginService.userId.toString();
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.RequestedData = JSON.stringify(this.signUpRD)
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/SignOfficial/  ',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      return Promise.resolve(this.refershSelectGameData(this.initialData));      
    });
  }

  getReportData(){
    this.reportGameData.SeasonId=this.loginService.seasonId;
    this.reportGameData.OfficialSeasonId = this.loginService.officialSeasonId;    
    this.finalFilter.RequestedData= JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/loadreportgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      return Promise.resolve(this.reportGameJson = x);      
    });
  }

  postReportData(gameListObj: any){
    this.requestStatus = 1;
    this.requestSuccess=false;
    this.requestFailure=false;
    this.finalFilter.RequestedData= JSON.stringify(gameListObj);    
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
    
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('http://testfaafireworks.1city.us/api/savereportgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      
      console.log(x);
      this.requestStatus = 0;
      if(x["Error"]==200){
        this.requestSuccess=true;        
      }
      else{
        this.requestFailure=true;
      }
      return Promise.resolve();      
    });
  }

}