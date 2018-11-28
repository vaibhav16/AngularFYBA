import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Filter } from '../models/official/select-game/filter.model';
import { LoginService} from './../login/login.service';
import { FinalFilter } from '../models/official/select-game/finalFilter.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { SignUpRequestedData } from '../models/official/select-game/signUp_rd.model';
import { IntialFilter } from '../models/official/select-game/initialFilter.model';
import { ReportGameData } from '../models/official/reportgame/reportGame.model';
import { APIGamePost } from '../models/official/reportgame/APIGamePost.model';
import { APIPlayerScorePost } from '../models/official/reportgame/APIPlayerScorePost.model';
import { SignUpEmail } from '../models/official/reportgame/signupEmail.model';
import { SignUp } from '../models/official/select-game/signup.model';
import { Profile } from './../models/official/profile/profile.model';
import { UploadProfileImage } from '../models/official/profile/uploadProfileImg.model';
import { DeleteProfileImage } from '../models/official/profile/deleteProfileImg.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class OfficialService {
 selectGameJson:JSON = null;
 reportGameJson:JSON = null;
 getPaidJson: JSON = null;
 requestStatus: number = 0;
 requestSuccess:boolean = false;
 requestFailure:boolean = false;
 numberOfSelectGameClicks:number = 0;
 initialData:Filter;

 initialFilter: IntialFilter = {
   UserID:'',
   SessionKey:''
 }

 finalFilter: FinalFilter={
  UserID:'',
  SessionKey:'',
  RequestedData:''
 }

 /* Select Game Definitions */

 selectedDivisions = [];
 selectedPositions = [];
 selectedLocations = [];
 selectedTimes = [];

 signUpEmailModel: SignUpEmail = {
  Email :'',
  LeagueId :'',
  SeasonId: '',
  Randomkey: ''
}

 signUpRD: SignUpRequestedData = {
     GameIds: '',
     GroupId: '',
     PositionID: '',
     OfficialSeasonId:'',
     ForCancelSignUp:'',
     SeasonId:'',
     LeagueId:''
 }

  /* Report Game Definitions */

 reportGameData: ReportGameData = {
   SeasonId:'',
   OfficialSeasonId:''
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

  /* Profile Section Definitions */

 profileModel: Profile = {
   LeagueId:'',
   SeasonId:''
 }

 uploadProfileImg : UploadProfileImage = {
  LeagueId:'',
  SeasonId:'', 
  Page:'',
  Files:[]
 };

 deleteProfileImg:DeleteProfileImage = {
  LeagueId:'',
  SeasonId:'',
  FileName: '',
  Page:''
 }


  constructor(private http: Http, public loginService: LoginService, private cookieService: CookieService) {  
    
  }

  /**************************/
  /* - Select Games - */
  /**************************/

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

  /* - Fetch Initial Data in Select Games - */
  postSelectGames(obj: Filter):any{  
    this.numberOfSelectGameClicks++;
    //this.finalFilter.RequestedData=JSON.stringify(obj);
    // this.initialFilter.SessionKey = this.cookieService.get('SessionKey');
    // this.initialFilter.UserID = this.cookieService.get('UserId');
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     

      console.log(x);
      this.fetchPreselectedFilters(x);      
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

    /* - Used to refresh the Data in Select Games after some change - */
  refershSelectGameData(obj: Filter):any{  
    //this.finalFilter.RequestedData=JSON.stringify(obj);
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

    /* - It prepares a JSON that can be used to populate the multi-select filters, in-case the 
    user had selected any in his previous session. If the user didn't it will be empty - */
  fetchPreselectedFilters(x:any){
    this.loginService.sessionKey=x["SessionKey"];

    if(x["Value"].SelectedFilters!=null){

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
   
  }

  /* - If the user selects any filter, it will be posted to the API and the data in 
  select game tab will be refreshed using the below function. -*/

  postFilterData(obj : Filter){ 
    
    this.finalFilter.RequestedData= JSON.stringify(obj);    
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    });
  }

  /* - This functin sends a signup request - */

  signUpStatus:boolean = false;
  signUpResponse:string=null;
  postSignUp(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
    this.signUpStatus=true;
    this.signUpResponse=null;
    this.signUpRD.GroupId=groupId;
    this.signUpRD.GameIds=gameId;
    this.signUpRD.PositionID=positionId;
    this.signUpRD.OfficialSeasonId=this.loginService.officialSeasonId;
    this.signUpRD.SeasonId = this.loginService.seasonId;
    this.signUpRD.LeagueId = this.loginService.leagueId;
    this.signUpRD.ForCancelSignUp=ForCancelSignUp;

    this.finalFilter.UserID=this.loginService.userId.toString();
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.RequestedData = JSON.stringify(this.signUpRD)
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/SignOfficial/  ',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      this.signUpStatus=false;
      this.signUpResponse = x["Value"];
      //if(this.signUpResponse=="Registered")
      //console.log(this.signUpResponse);
      return Promise.resolve(this.refershSelectGameData(this.initialData));      
    });
  }

   /* - If the user signup is successful, an email is sent to his email, if he chooses to receive it - */

  sendSignUpEmail(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
    this.signUpRD.GroupId=groupId;
    this.signUpRD.GameIds=gameId;
    this.signUpRD.PositionID=positionId;
    this.signUpRD.OfficialSeasonId=this.loginService.officialSeasonId;
    this.signUpRD.SeasonId = this.loginService.seasonId;
    this.signUpRD.LeagueId = this.loginService.leagueId;
    this.signUpRD.ForCancelSignUp=ForCancelSignUp;

    this.finalFilter.RequestedData= JSON.stringify(this.signUpRD);
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();

    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api//RequestSendMail',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.paidRequest=false;
      return Promise.resolve(this.getPaidJson = x);      
    });

  }

  /**************************/
  /* - Report Games - */
  /**************************/

   /* - Used to get initial data to populate the Report Games section. - */

  getReportData(){    
    this.reportGameData.SeasonId = this.loginService.seasonId;
    this.reportGameData.OfficialSeasonId = this.loginService.officialSeasonId;    
    this.finalFilter.RequestedData= JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/loadreportgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      return Promise.resolve(this.reportGameJson = x);      
    });
  }

   /* - This function is used to post the entire gameList model to the API.
   It comes into play when the ScoreKeeper make any changes to the player scores in a specific game. 
   An updated model with all the scores is sent to the database and the records are updated. - */

  postReportData(gameListObj: any){
    this.requestStatus = 1;
    this.requestSuccess=false;
    this.requestFailure=false;
    this.finalFilter.RequestedData= JSON.stringify(gameListObj);    
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    //console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
    
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/savereportgames',body,requestOptions)
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

  /**************************/
  /* - Get Paid Section - */
  /**************************/

   /* - This function is used to fetch the initial data to populate the Get Paid section. - */
  paidRequest:boolean = false;
  fetchGetPaidData(){
    this.paidRequest=true;
    this.reportGameData.SeasonId=this.loginService.seasonId;
    this.reportGameData.OfficialSeasonId = this.loginService.officialSeasonId;    
    this.finalFilter.RequestedData= JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/GetPaid',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.paidRequest=false;
      return Promise.resolve(this.getPaidJson = x);      
    });
  }
  
  /**************************/
  /* - Profile Section - */
  /************************/

  /* - This function is used to fetch the initial data to populate the Profile section. - */
  profileJson:JSON = null;
  fetchProfileRequest:boolean = null;
  fetchProfileData(){
    this.fetchProfileRequest=true;
    this.profileModel.SeasonId=this.loginService.seasonId;
    this.profileModel.LeagueId = this.loginService.leagueId;    
    this.finalFilter.RequestedData= JSON.stringify(this.profileModel);

    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/OfficiatingProfile',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.fetchProfileRequest=false;
      return Promise.resolve(this.profileJson = x);      
    });
  }

  tempModel={
    UserID:'',
    SessionKey:'',
    SeasonId:'',
    LeagueId:'',
    Files:[],
    Page:''
  }

  uploadProfileImage(uploadedImages:File[]){
    this.fetchProfileRequest=true;
    this.uploadProfileImg.SeasonId=this.loginService.seasonId;
    this.uploadProfileImg.LeagueId = this.loginService.leagueId;    
    this.uploadProfileImg.Files = uploadedImages;
    this.uploadProfileImg.Page = 'Profile'
    ///////

    this.tempModel.SeasonId=this.loginService.seasonId;
    this.tempModel.LeagueId = this.loginService.leagueId;    
    this.tempModel.Files = uploadedImages;
    this.tempModel.Page = 'Profile'
    this.tempModel.SessionKey = this.loginService.sessionKey;
    this.tempModel.UserID =this.loginService.userId.toString();
    

    //////
    this.finalFilter.RequestedData= JSON.stringify(this.uploadProfileImg);
    console.log(this.finalFilter);
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.tempModel);   
    console.log(JSON.stringify(this.tempModel));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post('https://fybaservice.sapplesystems.com/api/ftp',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.fetchProfileRequest=false;
      return Promise.resolve();      
    });
  }
}