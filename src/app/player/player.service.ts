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
import { map } from 'rxjs/operators';
import { Constants } from './../constants';
import { GetPlayer } from './models/getPlayer.model';
import { CookieService } from 'ngx-cookie-service';
import { DataSharingService } from './../data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  headerOptions;
  postRequestOptions;
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

  getPlayerProfile():Observable<any>{
    var getPlayerModel = new GetPlayer();
    getPlayerModel.UserID = this.dss.userId;
    getPlayerModel.SessionKey = this.dss.sessionKey;
    getPlayerModel.RequestedData = JSON.stringify({
      PlayerId: 7167,
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId
    });
    var body = JSON.stringify(getPlayerModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/PlayerDetails', body, this.postRequestOptions)

  }
}
