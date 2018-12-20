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
import { Constants } from './../models/constants';

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

//static APIUrl:string = "https://mobile.folsomyouthbasketball.com";
//static testAPIUrl:string = "https://fybaservice.sapplesystems.com";

 selectedFilter:Filter = {      
  Division: '',
  Location: '',
  StartTime: '',
  EndTime: '',
  Position: '',
  ShowSignedGames:null,   
  ShowPastGames:null     
} 

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
    NewImageByteCode:''}],
    DeletedScoreSheetImages:[{
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
  FileName:''
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

  // getSelectGames():any{    
  //   this.http.get("./assets/raw.json")
  //   .pipe(map((data: Response) => {
  //     return data.json()
  //   })).toPromise().then(x => {
  //     console.log(x);
  //     this.fetchPreselectedFilters(x);
  //     return Promise.resolve(this.selectGameJson = x);      
  //   });
  // }

  /* - Fetch Initial Data in Select Games - */
  fetchSelectGames=null;
  postSelectGames(obj: Filter):any{  
    this.serviceError=false;
    this.fetchSelectGames=true;
    this.numberOfSelectGameClicks++;
    //this.finalFilter.RequestedData=JSON.stringify(obj);    
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
    console.log(JSON.stringify(this.initialFilter));
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     

      console.log(x);
      this.fetchPreselectedFilters(x); 
      this.fetchSelectGames=false;     
      return Promise.resolve(this.selectGameJson = x);      
    }).catch(err=>{this.handleError(err)});
  }
  
  serviceError:boolean;
  private handleError(error: any) {    
    this.serviceError=true;
    this.fetchSelectGames=false;
    this.reportRequest=false;
    this.fetchProfileRequest=false;
    this.paidRequest=false;
    console.log('A Server Error has occured!', error);    
    }

    /* - Used to refresh the Data in Select Games after some change - */
  refershSelectGameData(obj: Filter):any{  
    //this.finalFilter.RequestedData=JSON.stringify(obj);
    this.initialFilter.SessionKey = this.loginService.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.loginService.userId);
    var body = JSON.stringify(this.initialFilter);   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      return Promise.resolve(this.selectGameJson = x);      
    }).catch(err=>{this.handleError(err)});
  }

    /* - It prepares a JSON that can be used to populate the multi-select filters, in-case the 
    user had selected any in his previous session. If the user didn't it will be empty - */
  fetchPreselectedFilters(x:any){
    let y;
    this.loginService.sessionKey=x["SessionKey"];

    if(x["Value"].SelectedFilters!=null){
      
      if(x["Value"].SelectedFilters.Division!=null){
        y = x["Value"].SelectedFilters.Division.split(",");

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
      }


      if(x["Value"].SelectedFilters.StartTime!=null){

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

      if(x["Value"].SelectedFilters.Location!=null){

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

      }

      if(x["Value"].SelectedFilters.Position!=null){

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
    return this.http.post(Constants.apiURL+'/api/officialgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      return Promise.resolve(this.selectGameJson = x);      
    }).catch(err=>{this.handleError(err)});
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
    return this.http.post(Constants.apiURL+'/api/SignOfficial',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      this.signUpStatus=false;
      this.signUpResponse = x["Value"];
      //if(this.signUpResponse=="Registered")
      //console.log(this.signUpResponse);
      return Promise.resolve(this.refershSelectGameData(this.initialData));      
    }).catch(err=>{this.handleError(err)});
  }

   /* - If the user signup is successful, an email is sent to his email, if he chooses to receive it - */

  sendSignUpEmail(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
    this.fetchSelectGames=true;
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
    return this.http.post(Constants.apiURL+'/api//RequestSendMail',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      //this.paidRequest=false;
      this.postSelectGames(this.selectedFilter);
      return Promise.resolve();      
    }).catch(err=>{this.handleError(err)});

  }

  
  sendCancelSignUpEmail(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
    this.fetchSelectGames=true;
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
    return this.http.post(Constants.apiURL+'/api//RequestSendMail',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.postSelectGames(this.selectedFilter);
      //this.paidRequest=false;
      return Promise.resolve();      
    }).catch(err=>{this.handleError(err)});

  }

  /**************************/
  /* - Report Games - */
  /**************************/

   /* - Used to get initial data to populate the Report Games section. - */

   reportRequest:boolean;
  getReportData(){
    this.serviceError=false;
    this.reportRequest=true;
    this.reportGameData.SeasonId = this.loginService.seasonId;
    this.reportGameData.OfficialSeasonId = this.loginService.officialSeasonId;    
    this.finalFilter.RequestedData= JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
   
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/loadreportgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      this.reportRequest=false;      
      console.log(x);
      return Promise.resolve(this.reportGameJson = x);      
    }).catch(err=>{this.handleError(err)});;
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
    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);   
    console.log(JSON.stringify(this.finalFilter));
    
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/savereportgames',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      
      console.log(x);
      this.requestStatus = 0;
      if(x["Error"]==200){
        this.requestSuccess=true;    
        this.loginService.reportTagLabel=x["Value"];
        this.cookieService.set("reportTagLabel",x["Value"]);
        console.log(this.loginService.reportTagLabel);    
      }
      else{
        this.requestFailure=true;
      }
      return Promise.resolve();      
    }).catch(err=>{this.handleError(err)});
  }

  /**************************/
  /* - Get Paid Section - */
  /**************************/

   /* - This function is used to fetch the initial data to populate the Get Paid section. - */
  paidRequest:boolean = false;
  fetchGetPaidData(){
    this.serviceError=false;
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
    return this.http.post(Constants.apiURL+'/api/GetPaid',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.paidRequest=false;
      return Promise.resolve(this.getPaidJson = x);      
    }).catch(err=>{this.handleError(err)});
  }
  
  /**************************/
  /* - Profile Section - */
  /************************/

  /* - This function is used to fetch the initial data to populate the Profile section. - */
  profileJson:JSON = null;
  fetchProfileRequest:boolean = null;
  fetchProfileData(){
    this.serviceError=false;
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
    return this.http.post(Constants.apiURL+'/api/OfficiatingProfile',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.fetchProfileRequest=false;
      return Promise.resolve(this.profileJson = x);      
    }).catch(err=>{this.handleError(err)});
  }

  tempModel={
    UserID:'',
    SessionKey:'',
    SeasonId:'',
    LeagueId:'',
    Files:[],
    Page:''
  }

  newImage:string;
  newThumbnail:string;
  uploadProfileImage(newImgByteCode: string){
    //console.log(newImgByteCode);
    this.fetchProfileRequest=true;
    this.uploadProfileImg.SeasonId=this.loginService.seasonId;
    this.uploadProfileImg.LeagueId = this.loginService.leagueId;    
    this.uploadProfileImg.FileName = newImgByteCode;
    this.uploadProfileImg.Page = 'Profile';

    this.finalFilter.RequestedData= JSON.stringify(this.uploadProfileImg);    
    this.finalFilter.SessionKey = this.loginService.sessionKey;
    this.finalFilter.UserID =this.loginService.userId.toString();

    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);   
    //console.log(JSON.stringify(this.finalFilter));
 
    var headerOptions =  new Headers();
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    //headerOptions.append('Accept', 'application/json');
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/ftp',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {   
      console.log(x);
      this.newImage=x.Value.Link;
      if(x["Message"]=="Successful"){
        this.loginService.cookieService.set('roundThumbnail',x["Value"].RoundThumbnail);
        this.loginService.roundThumbnail=x["Value"].RoundThumbnail; 
        this.newThumbnail = x["Value"].Thumbnail; 
        console.log(x["Value"].RoundThumbnail);
      }
      this.fetchProfileRequest=false;
      return Promise.resolve();      
    }).catch(err=>{this.handleError(err)});
  }

  deleteProfileImage(fileName: string){
     //console.log(newImgByteCode);
     this.fetchProfileRequest=true;
     this.uploadProfileImg.SeasonId=this.loginService.seasonId;
     this.uploadProfileImg.LeagueId = this.loginService.leagueId;    
     this.uploadProfileImg.FileName = fileName;
     this.uploadProfileImg.Page = 'Profile';
 
     this.finalFilter.RequestedData= JSON.stringify(this.uploadProfileImg);    
     this.finalFilter.SessionKey = this.loginService.sessionKey;
     this.finalFilter.UserID =this.loginService.userId.toString();
 
     console.log(this.finalFilter);
     var body = JSON.stringify(this.finalFilter);   
     console.log(JSON.stringify(this.finalFilter));
  
     var headerOptions =  new Headers();
     var headerOptions =  new Headers({'Content-Type':'application/json'});
     //headerOptions.append('Accept', 'application/json');
     var requestOptions = new RequestOptions({method: RequestMethod.Delete, headers: headerOptions});
     return this.http.post(Constants.apiURL+'/api/ftp',body,requestOptions)
     .pipe(map((data: Response) => {
       return data.json()
     })).toPromise().then(x => {   
       console.log(x);
       if(x["Value"].Error=="404"|| x["Message"]=="Session Error"){
         this.serviceError=true;
        //this.loginService.roundThumbnail=x["Value"].RoundThumbnail;  
        //console.log(x["Value"].RoundThumbnail);
      }
      else{
        this.loginService.roundThumbnail="https://res.cloudinary.com/dkb0muxbz/image/upload/c_fill,h_50,r_max,w_50/DefaultProfileImage.jpg";
        this.loginService.cookieService.set('roundThumbnail',"https://res.cloudinary.com/dkb0muxbz/image/upload/c_fill,h_50,r_max,w_50/DefaultProfileImage.jpg");
      }
       this.fetchProfileRequest=false;
       return Promise.resolve();      
     }).catch(err=>{this.handleError(err)});
  }
}