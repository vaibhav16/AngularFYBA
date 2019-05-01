import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  RequestMethod,
  ResponseContentType
} from '@angular/http';
import { Observable, ObservableLike } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Constants } from './../constants';
import { GetPlayer } from './models/getPlayer.model';
import { CookieService } from 'ngx-cookie-service';
import { DataSharingService } from './../data-sharing.service';
import { IEmail } from './models/Iemail.model';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  headerOptions;
  postRequestOptions;
  playerId;
  profileData = null;
  backClick = false;
  recepient: string;
  emailFlag:boolean;
  iEmail:IEmail;
  //recepeients:string[] = [];
  constructor(private http: Http, private dss: DataSharingService) {
    this.headerOptions = new Headers({ 'Content-Type': 'application/json' });
    this.postRequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: this.headerOptions
    });
  }

  getPlayerData(): Observable<any> {
    var getPlayerModel = new GetPlayer();
    getPlayerModel.UserID = this.dss.userId;
    getPlayerModel.SessionKey = this.dss.sessionKey;
    getPlayerModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId
    });
    var body = JSON.stringify(getPlayerModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/Player', body, this.postRequestOptions);
  }

  getTeamInfo(): Observable<any> {
    console.log(this.playerId);
    var getPlayerModel = new GetPlayer();
    getPlayerModel.UserID = 11199;
    getPlayerModel.SessionKey = this.dss.sessionKey;
    if (this.playerId != undefined) {
      getPlayerModel.RequestedData = JSON.stringify({
        PlayerId: this.playerId,
        LeagueId: this.dss.leagueId,
        SeasonId: this.dss.seasonId,
        RoleId: this.dss.roleId
      });
      var body = JSON.stringify(getPlayerModel);
      console.log(body);
      return this.http.post(Constants.apiURL + '/api/TeamInfo', body, this.postRequestOptions);
    }
  }

  getPlayerProfile():Observable<any>{
    var getPlayerModel = new GetPlayer();
    getPlayerModel.UserID = this.dss.userId;
    getPlayerModel.SessionKey = this.dss.sessionKey;
    getPlayerModel.RequestedData = JSON.stringify({
      PlayerId: this.playerId,
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId
    });
    var body = JSON.stringify(getPlayerModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/PlayerDetails', body, this.postRequestOptions);

  }


  sendEmail(subject,emailBody): Observable<any> {
    var emailModel = new IEmail();
    emailModel.UserID = this.dss.userId;
    emailModel.SessionKey = this.dss.sessionKey;
    emailModel.RequestedData = JSON.stringify({
      ToEmailIds:this.recepient,
      FromEmailId: this.dss.email,
      Subject: subject,
      Body: emailBody,
      SeasonId: this.dss.seasonId,
      LeagueId: this.dss.leagueId
    });

    var body = JSON.stringify(emailModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/SendMail', body, this.postRequestOptions);
  }

  saveProfileData(requestedData):Observable<any>{
    var saveProfileModel = new GetPlayer();
    saveProfileModel.UserID = this.dss.userId;
    saveProfileModel.SessionKey = this.dss.sessionKey;
    saveProfileModel.RequestedData = requestedData;
    var body = JSON.stringify(saveProfileModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/PlayerDetailsSave', body, this.postRequestOptions);
  }

  withdrawPlayer():Observable<any>{
    var saveProfileModel = new GetPlayer();
    saveProfileModel.UserID = this.dss.userId;
    saveProfileModel.SessionKey = this.dss.sessionKey;
    //saveProfileModel.RequestedData = requestedData;
    var body = JSON.stringify(saveProfileModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/PlayerDetailsSave', body, this.postRequestOptions);
  }
  // get backClicked(){
  //   return this.backClick;
  // }

  // set backClicked(x){
  //   this.backClick=x;
  // }
  
  // setBackClicked(x){
  //   this.backClicked=x;
  // }
}
